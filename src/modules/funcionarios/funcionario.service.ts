import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FiltroDto } from 'src/common/dtos/filtro.dto';
import { BaseService } from 'src/common/services/base.service';
import { plainToInstance } from 'class-transformer';
import { Funcionario } from './entities/funcionario.entity';
import { FuncionarioDto } from './dtos/funcionario.dto';
import { Context } from 'src/common/storage/context';

@Injectable()
export class FuncionarioService extends BaseService {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
    protected context: Context,
  ) {
    super(context);
  }

  async criar(request: FuncionarioDto): Promise<Funcionario> {
    if (await this.obterPorNome(request.nome)) {
      throw new BadRequestException('Funcionario já cadastrada');
    }

    const speciality = this.funcionarioRepository.create(request);
    return await this.funcionarioRepository.save(speciality);
  }

  async editar(id: number, request: FuncionarioDto): Promise<any> {
    const speciality = await this.obterPorId(id);
    if (!speciality) {
      throw new BadRequestException(
        `Funcionario com o ID: ${id} não encontrada`,
      );
    }

    this.funcionarioRepository.merge(speciality as Funcionario, request);
    return await this.funcionarioRepository.save(speciality);
  }

  async obterTodos(filter: FiltroDto): Promise<FuncionarioDto[]> {
    const queryBuilder = this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .select([
        'funcionario.id',
        'funcionario.nome',
        'funcionario.email',
        'funcionario.empresaId',
      ])
      .where('funcionario.empresaId = :empresaId', {
        empresaId: this.getEmpresaId(),
      });

    this.aplicarFiltros(queryBuilder, filter);

    const itens = await queryBuilder.getMany();
    return plainToInstance(FuncionarioDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Funcionario>,
    filter: FiltroDto,
  ): void {
    if (filter?.nome) {
      queryBuilder.andWhere('funcionario.nome LIKE :nome', {
        nome: `%${filter.nome}%`,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const speciality = await this.funcionarioRepository.findOneBy({ id });
    if (!speciality) {
      throw new NotFoundException('Funcionario não encontrada');
    }

    return speciality;
  }

  async obterPorNome(nome: string): Promise<Funcionario | null> {
    return this.funcionarioRepository.findOneBy({ nome });
  }

  async remover(id: number): Promise<void> {
    await this.funcionarioRepository.delete(id);
  }
}
