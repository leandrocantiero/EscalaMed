import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from 'src/modules/usuarios/usuario.controller';
import { UsuarioService } from 'src/modules/usuarios/usuario.service';
import { UsuarioCriadoListener } from 'src/common/listeners/usuario-criado.listener';
import { Usuario } from './entities/usuario.entity';
import { AutenticacaoFactoryModule } from '../autenticacao/autenticacao-factory.module';
import { EmpresaModule } from '../empresas/empresa.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    AutenticacaoFactoryModule.forRoot(),
    EmpresaModule,
    EmailModule,
  ],
  providers: [UsuarioService, UsuarioCriadoListener],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
