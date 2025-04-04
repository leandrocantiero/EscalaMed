import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidade } from './entities/especialidade.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FiltroDto } from 'src/common/dtos/filtro.dto';
import { EspecialidadeDto } from './dtos/especialidade.dto';
import { BaseService } from 'src/common/services/base.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Context } from 'src/common/storage/context';

@Injectable()
export class EspecialidadeService extends BaseService {
  constructor(
    @InjectRepository(Especialidade)
    private especialidadeRepository: Repository<Especialidade>,
    protected context: Context,
  ) {
    super(context);
  }

  async criar(request: EspecialidadeDto): Promise<Especialidade> {
    if (await this.obterPorNome(request.nome)) {
      throw new BadRequestException('Especialidade já cadastrada');
    }

    const speciality = this.especialidadeRepository.create(request);
    return await this.especialidadeRepository.save(speciality);
  }

  async editar(id: number, request: EspecialidadeDto): Promise<any> {
    const speciality = await this.obterPorId(id);
    if (!speciality) {
      throw new BadRequestException(
        `Especialidade com o ID: ${id} não encontrada`,
      );
    }

    this.especialidadeRepository.merge(speciality as Especialidade, request);
    return await this.especialidadeRepository.save(speciality);
  }

  async obterTodos(filter: FiltroDto): Promise<EspecialidadeDto[]> {
    const queryBuilder = this.especialidadeRepository
      .createQueryBuilder('especialiadade')
      .select([
        'especialiadade.id',
        'especialiadade.nome',
        'especialiadade.descricao',
        'especialiadade.empresaId',
      ])
      .where('especialiadade.empresaId = :empresaId', {
        empresaId: this.getEmpresaId(),
      });

    this.aplicarFiltros(queryBuilder, filter);

    const itens = await queryBuilder.getMany();
    return plainToInstance(EspecialidadeDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Especialidade>,
    filter: FiltroDto,
  ): void {
    if (filter?.nome) {
      queryBuilder.andWhere('especialiadade.nome LIKE :nome', {
        nome: `%${filter.nome}%`,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const speciality = await this.especialidadeRepository.findOneBy({ id });
    if (!speciality) {
      return new NotFoundException('Especialidade não encontrada');
    }

    return speciality;
  }

  async obterPorNome(nome: string): Promise<Especialidade | null> {
    return this.especialidadeRepository.findOneBy({ nome });
  }

  async remover(id: number): Promise<void> {
    await this.especialidadeRepository.delete(id);
  }
}
