import { Injectable } from '@nestjs/common';
import { EmpresaContext } from '../storage/empresa.storage';

@Injectable()
export class BaseService {
  protected getempresaId(): number {
    const empresaId = EmpresaContext.getempresaId();
    if (!empresaId) throw new Error('empresaId não definido!');

    return parseInt(empresaId);
  }
}
