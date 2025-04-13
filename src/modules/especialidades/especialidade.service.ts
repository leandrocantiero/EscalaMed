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
    if (await this.obterPorNome(request.nome, this.getEmpresaId())) {
      throw new BadRequestException('Especialidade já cadastrada');
    }

    const especialidade = this.especialidadeRepository.create(request);
    return await this.especialidadeRepository.save(especialidade);
  }

  async editar(id: number, request: EspecialidadeDto): Promise<any> {
    const especialidade = await this.obterPorId(id);
    if (!especialidade) {
      throw new BadRequestException(
        `Especialidade com o ID: ${id} não encontrada`,
      );
    }

    this.especialidadeRepository.merge(especialidade as Especialidade, request);
    return await this.especialidadeRepository.save(especialidade);
  }

  async obterTodos(filtro: FiltroDto): Promise<EspecialidadeDto[]> {
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

    this.aplicarFiltros(queryBuilder, filtro);

    const itens = await queryBuilder.getMany();
    return plainToInstance(EspecialidadeDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Especialidade>,
    filtro: FiltroDto,
  ): void {
    if (filtro?.busca) {
      queryBuilder.andWhere('especialiadade.nome LIKE :nome', {
        nome: `%${filtro.busca}%`,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const especialidade = await this.especialidadeRepository.findOneBy({ id });
    if (!especialidade) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    return especialidade;
  }

  async obterPorNome(
    nome: string,
    empresaId: number | undefined,
  ): Promise<Especialidade | null> {
    console.log(empresaId);
    return this.especialidadeRepository.findOneBy({ nome, empresaId });
  }

  async remover(id: number): Promise<void> {
    await this.especialidadeRepository.delete(id);
  }
}
