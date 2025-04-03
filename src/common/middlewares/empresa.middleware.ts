import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { EmpresaContext } from '../storage/empresa.storage';

@Injectable()
export class EmpresaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    EmpresaContext.set(req['usuario']?.empresaId as string, next);
  }
}
