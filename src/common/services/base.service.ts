import { Injectable } from '@nestjs/common';
import { Context } from '../storage/context';
import { StorageDto } from '../storage/dtos/storage.dto';

@Injectable()
export class BaseService {
  constructor(protected context: Context) {}

  protected getEmpresaId(): number {
    const storage = this.context.get<StorageDto>();
    return storage.usuario?.empresaId;
  }
}
