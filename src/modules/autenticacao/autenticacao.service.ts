import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuarios/usuario.service';
import { HashService } from '../hash/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacaoService {
  constructor(
    private usuarioService: UsuarioService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senhaLogin: string): Promise<any> {
    const usuario = await this.usuarioService.obterPorEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.hashService.comparePasswords(
      senhaLogin,
      usuario.senha,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { senha, ...usuarioSemSenha } = usuario;

    return {
      usuario: usuarioSemSenha,
      accessToken: this.jwtService.sign(usuarioSemSenha),
    };
  }

  async validarToken(token: string): Promise<boolean> {
    try {
      return !!(await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      }));
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }
}
