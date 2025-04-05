import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FiltroDto } from 'src/common/dtos/filtro.dto';
import { Empresa } from './entities/empresa.entity';
import { EmpresaDto } from './dtos/empresa.dto';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Context } from 'src/common/storage/context';
import { BaseService } from 'src/common/services/base.service';
import Stripe from 'stripe';

@Injectable()
export class EmpresaService extends BaseService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    private eventEmitter: EventEmitter2,
    protected context: Context,
  ) {
    super(context);
  }

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
    const queryBuilder = this.empresaRepository
      .createQueryBuilder('empresa')
      .select([
        'empresa.id',
        'empresa.nome',
        'empresa.email',
        'empresa.cnpj',
        'empresa.empresaId',
      ]);

    this.aplicarFiltros(queryBuilder, filter);

    const itens = await queryBuilder.getMany();
    return plainToInstance(EmpresaDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Empresa>,
    filter: FiltroDto,
  ): void {
    if (filter?.nome) {
      queryBuilder.andWhere('empresa.nome LIKE :nome', {
        nome: `%${filter.nome}%`,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const empresa = await this.empresaRepository.findOneBy({ id });
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async obterPorCnpj(cnpj: string): Promise<Empresa | null> {
    return this.empresaRepository.findOneBy({ cnpj });
  }

  async remover(id: number): Promise<void> {
    await this.empresaRepository.delete(id);
  }

  async salvarDadosStripe(empresa: Empresa, clienteStripe: Stripe.Customer) {
    const dados = {
      stripeCustomerId: clienteStripe.id,
    };

    console.log('salvarDadosStripe', dados);

    this.empresaRepository.merge(empresa, dados);
    return await this.empresaRepository.save(empresa);
  }
}
