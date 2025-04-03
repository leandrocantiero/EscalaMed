import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiltroDto } from 'src/common/dtos/filter.dto';
import { Empresa } from './entities/empresa.entity';
import { EmpresaDto } from './dtos/empresa.dto';
import { plainToClass } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    private eventEmitter: EventEmitter2,
  ) {}

  async criar(request: EmpresaDto): Promise<Empresa> {
    if (await this.obterPorCnpj(request.cnpj)) {
      throw new BadRequestException('Empresa já cadastrada');
    }

    if (!request.fantasia) {
      request.fantasia = request.nome;
    }

    const empresa = this.empresaRepository.create(request);
    await this.empresaRepository.save(empresa);

    this.eventEmitter.emit('empresa.criada', empresa);

    return empresa;
  }

  async editar(id: number, request: EmpresaDto): Promise<any> {
    const empresa = await this.obterPorId(id);
    if (!empresa) {
      throw new BadRequestException(`Empresa com o ID: ${id} não encontrada`);
    }

    this.empresaRepository.merge(empresa as Empresa, request);
    return await this.empresaRepository.save(empresa);
  }

  async obterTodos(filter: FiltroDto): Promise<EmpresaDto[]> {
    const queryBuilder = this.empresaRepository.createQueryBuilder('empresa');

    queryBuilder.select(['id', 'nome', 'cnpj']);

    if (filter?.nome) {
      queryBuilder.andWhere('nome LIKE :nome', {
        nome: `%${filter.nome}%`,
      });
    }

    return (await queryBuilder.getMany()).map((i) =>
      plainToClass(EmpresaDto, i),
    );
  }

  async obterPorId(id: number): Promise<any> {
    const empresa = await this.empresaRepository.findOneBy({ id });
    if (!empresa) {
      return new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async obterPorCnpj(cnpj: string): Promise<Empresa | null> {
    return this.empresaRepository.findOneBy({ cnpj });
  }

  async remover(id: number): Promise<void> {
    await this.empresaRepository.delete(id);
  }
}
