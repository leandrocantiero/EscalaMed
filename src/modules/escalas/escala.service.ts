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
import { Context } from 'src/common/storage/context';
import { Escala } from './entities/escala.entity';
import { EscalaDto } from './dtos/escala.dto';

@Injectable()
export class EscalaService extends BaseService {
    constructor(
        @InjectRepository(Escala)
        private escalaRepository: Repository<Escala>,
        protected context: Context,
    ) {
        super(context);
    }

    async criar(request: EscalaDto): Promise<Escala> {
        if (await this.obterPorNome(request.nome)) {
            throw new BadRequestException('Escala já cadastrada');
        }

        const escala = this.escalaRepository.create(request);
        return await this.escalaRepository.save(escala);
    }

    async editar(id: number, request: EscalaDto): Promise<any> {
        const escala = await this.obterPorId(id);
        if (!escala) {
            throw new BadRequestException(
                `escala com o ID: ${id} não encontrada`,
            );
        }

        this.escalaRepository.merge(escala as Escala, request);
        return await this.escalaRepository.save(escala);
    }

    async obterTodos(filtro: FiltroDto): Promise<EscalaDto[]> {
        const queryBuilder = this.escalaRepository
            .createQueryBuilder('escala')
            .select([
                'escala.id',
                'escala.nome',
            ])
            .where('escala.empresaId = :empresaId', {
                empresaId: this.getEmpresaId(),
            });

        this.aplicarFiltros(queryBuilder, filtro);
        this.aplicarPaginacao(queryBuilder, filtro);

        const itens = await queryBuilder.getMany();
        return plainToInstance(EscalaDto, itens);
    }

    private aplicarFiltros(
        queryBuilder: SelectQueryBuilder<Escala>,
        filtro: FiltroDto,
    ): void {
        if (filtro?.busca) {
            queryBuilder.andWhere('escala.nome LIKE :nome', {
                nome: `%${filtro.busca}%`,
            });
        }
    }

    async obterPorId(id: number): Promise<any> {
        const escala = await this.escalaRepository.findOneBy({ id });
        if (!escala) {
            throw new NotFoundException('Escala não encontrada');
        }

        return escala;
    }

    async obterPorNome(nome: string): Promise<Escala | null> {
        return this.escalaRepository.findOneBy({ nome });
    }

    async remover(id: number): Promise<void> {
        await this.escalaRepository.delete(id);
    }
}