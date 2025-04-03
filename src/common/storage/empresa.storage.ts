import { AsyncLocalStorage } from 'async_hooks';

export class EmpresaContext {
  private static storage = new AsyncLocalStorage<{ empresaId: string }>();

  static set(empresaId: string, callback: () => void) {
    this.storage.run({ empresaId }, callback);
  }

  static getempresaId(): string | undefined {
    return this.storage.getStore()?.empresaId;
  }
}
