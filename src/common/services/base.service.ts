import { Injectable } from '@nestjs/common';
import { Context } from '../storage/context';
import { StorageDto } from '../storage/dtos/storage.dto';
import { SelectQueryBuilder } from 'typeorm';
import { FiltroDto } from '../dtos/filtro.dto';

@Injectable()
export class BaseService {
  constructor(protected context: Context) { }

  protected getEmpresaId(): number {
    const storage = this.context.get<StorageDto>();
    return storage.usuario?.empresaId;
  }

  protected aplicarPaginacao(queryBuilder: SelectQueryBuilder<any>, filtro: FiltroDto) {
    const page = filtro.page && filtro.page > 0 ? filtro.page : 1;
    const limit = filtro.limit && filtro.limit > 0 ? filtro.limit : 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
  }
}
