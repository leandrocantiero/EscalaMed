import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { StorageDto } from './dtos/storage.dto';

@Injectable()
export class Context {
  private storage: AsyncLocalStorage<StorageDto>;

  constructor() {
    this.storage = new AsyncLocalStorage();
  }

  get<T>(): T {
    return this.storage.getStore() as T;
  }

  runWith(context: StorageDto, callback: () => void): void {
    this.storage.run(context, callback);
  }
}
