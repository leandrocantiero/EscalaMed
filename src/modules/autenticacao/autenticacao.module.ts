import { Module } from '@nestjs/common';
import { AutenticacaoService } from 'src/modules/autenticacao/autenticacao.service';
import { UsuarioModule } from '../usuarios/usuario.module';
import { AutenticacaoController } from './autenticacao.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AutenticacaoFactoryModule } from './autenticacao-factory.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsuarioModule, AutenticacaoFactoryModule.forRoot(), JwtModule],
  providers: [AutenticacaoService, AuthGuard],
  controllers: [AutenticacaoController],
  exports: [AutenticacaoService, AuthGuard],
})
export class AutenticacaoModule {}
