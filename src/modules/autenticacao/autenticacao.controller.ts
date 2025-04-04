import { Body, Controller, Get, Post } from '@nestjs/common';
import { AutenticacaoService } from 'src/modules/autenticacao/autenticacao.service';
import { LoginDto } from './dtos/login.dto';
import { UsuarioDto } from '../usuarios/dtos/usuario.dto';
import { UsuarioService } from '../usuarios/usuario.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(
    private readonly autenticacaoService: AutenticacaoService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.autenticacaoService.login(loginDto.email, loginDto.senha);
  }

  @Post('/registro')
  @ApiBody({ type: UsuarioDto })
  async registro(@Body() request: UsuarioDto): Promise<any> {
    return this.usuarioService.criar(request);
  }

  @Post('/validar-token')
  async validarToken(@Body('token') token: string): Promise<any> {
    console.log(token);
    return this.autenticacaoService.validarToken(token);
  }
}
