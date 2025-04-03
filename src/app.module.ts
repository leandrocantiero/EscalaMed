import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/database';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';

import { EspecialidadeModule } from './modules/especialidades/especialidade.module';
import { UsuarioModule } from './modules/usuarios/usuario.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';
import { HashModule } from './modules/hash/hash.module';
import { TaskModule } from './modules/tasks/task.module';
import { FuncionarioModule } from './modules/funcionarios/funcionario.module';
import { join } from 'path';
import { StripeModule } from './modules/stripe/stripe.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    HashModule,
    UsuarioModule,
    AutenticacaoModule,
    EspecialidadeModule,
    FuncionarioModule,
    TaskModule,
    StripeModule,
  ],
  controllers: [AppController],
  exports: [AppModule, UsuarioModule, AutenticacaoModule, HashModule],
})
export class AppModule {}
