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
      throw new BadRequestException('Funcionario já cadastrado');
    }

    const funcionario = this.funcionarioRepository.create(request);
    return await this.funcionarioRepository.save(funcionario);
  }

  async editar(id: number, request: FuncionarioDto): Promise<any> {
    const funcionario = await this.obterPorId(id);
    if (!funcionario) {
      throw new BadRequestException(
        `Funcionario com o ID: ${id} não encontrada`,
      );
    }

    this.funcionarioRepository.merge(funcionario as Funcionario, request);
    return await this.funcionarioRepository.save(funcionario);
  }

  async obterTodos(filtro: FiltroDto): Promise<FuncionarioDto[]> {
    const queryBuilder = this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .leftJoin('funcionario.especialidade', 'especialidade')
      .select([
        'funcionario.id',
        'funcionario.nome',
        'funcionario.cpf',
        'funcionario.crm',
        'funcionario.email',
        'funcionario.isAtivo',
        'funcionario.especialidadeId',
        'funcionario.empresaId',
        'especialidade.nome',
      ])
      .where('funcionario.empresaId = :empresaId', {
        empresaId: this.getEmpresaId(),
      });

    this.aplicarFiltros(queryBuilder, filtro);
    this.aplicarPaginacao(queryBuilder, filtro);

    const itens = await queryBuilder.getMany();
    return plainToInstance(FuncionarioDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Funcionario>,
    filtro: FiltroDto,
  ): void {
    if (filtro?.busca) {
      queryBuilder.andWhere('funcionario.nome LIKE :nome', {
        nome: `%${filtro.busca}%`,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const funcionario = await this.funcionarioRepository.findOneBy({ id });
    if (!funcionario) {
      throw new NotFoundException('Funcionario não encontrado');
    }

    return funcionario;
  }

  async obterPorNome(nome: string): Promise<Funcionario | null> {
    return this.funcionarioRepository.findOneBy({ nome });
  }

  async remover(id: number): Promise<void> {
    await this.funcionarioRepository.delete(id);
  }
}
