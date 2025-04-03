import { TestingModule, Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface TestingModuleFactoryOptions {
  controllers?: any[];
  providers?: any[];
  repositoryMocks?: {
    entity: any; // Tipo da entidade
    mock: Partial<Repository<any>>; // Mock do repositório
  }[];
  providerMocks?: {
    provide: any;
    useValue: any;
  }[];
}

export async function createTestingModule(
  options: TestingModuleFactoryOptions,
): Promise<TestingModule> {
  const moduleBuilder = Test.createTestingModule({
    controllers: options.controllers || [],
    providers: options.providers || [],
  });

  if (options.repositoryMocks) {
    options.repositoryMocks.forEach(({ entity, mock }) => {
      const defaultMock: Partial<Repository<any>> = {
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        ...mock,
      };

      moduleBuilder
        .overrideProvider(getRepositoryToken(entity))
        .useValue(defaultMock);
    });
  }

  if (options.providerMocks) {
    options.providerMocks.forEach((provider) => {
      moduleBuilder
        .overrideProvider(provider.provide)
        .useValue(provider.useValue);
    });
  }

  moduleBuilder.overrideProvider(EventEmitter2).useValue({ emit: jest.fn() });

  return await moduleBuilder.compile();
}
