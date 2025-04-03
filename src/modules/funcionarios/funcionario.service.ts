import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiltroDto } from 'src/common/dtos/filter.dto';
import { BaseService } from 'src/common/services/base.service';
import { plainToClass } from 'class-transformer';
import { Funcionario } from './entities/funcionario.entity';
import { FuncionarioDto } from './dtos/funcionario.dto';

@Injectable()
export class FuncionarioService extends BaseService {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
  ) {
    super();
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
    const queryBuilder =
      this.funcionarioRepository.createQueryBuilder('speciality');

    queryBuilder.select(['id', 'nome', 'description']);

    if (filter?.nome) {
      queryBuilder.andWhere('speciality.nome LIKE :nome', {
        nome: `%${filter.nome}%`,
      });
    }

    queryBuilder.where({ empresaId: this.getempresaId() });

    return (await queryBuilder.getMany()).map((i) =>
      plainToClass(FuncionarioDto, i),
    );
  }

  async obterPorId(id: number): Promise<any> {
    const speciality = await this.funcionarioRepository.findOneBy({ id });
    if (!speciality) {
      return new NotFoundException('Funcionario não encontrada');
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
