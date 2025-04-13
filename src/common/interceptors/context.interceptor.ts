import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Context } from '../storage/context';
import { StorageDto } from '../storage/dtos/storage.dto';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private context: Context) { }

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = executionContext.switchToHttp().getRequest();
    const usuario = request['usuario'];

    if (
      usuario?.empresaId &&
      typeof request.body === 'object' &&
      request.body !== null
    ) {
      request.body.empresaId = usuario.empresaId;
    }

    const store: StorageDto = { usuario };

    return new Observable((observer) => {
      this.context.runWith(store, () => {
        next.handle().subscribe({
          next: (res) => observer.next(res),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
