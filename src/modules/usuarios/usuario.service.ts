import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { UsuarioDto } from './dtos/usuario.dto';
import { UsuarioFiltroDto } from './dtos/usuario-filtro.dto';
import { Role } from 'src/common/constants/roles.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseService } from 'src/common/services/base.service';
import { Usuario } from './entities/usuario.entity';
import { plainToInstance } from 'class-transformer';
import { EmpresaService } from '../empresas/empresa.service';
import { Context } from 'src/common/storage/context';

@Injectable()
export class UsuarioService extends BaseService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private hashService: HashService,
    private eventEmitter: EventEmitter2,
    private empresaService: EmpresaService,
    protected context: Context,
  ) {
    super(context);
  }

  async criar(request: UsuarioDto): Promise<any> {
    await this.validarCriarUsuario(request);
    await this.validarEmpresaEPermissoes(request);

    request.senha = await this.hashService.hashPassword(request.senha);

    const usuario = this.usuarioRepository.create(request);
    await this.usuarioRepository.save(usuario);

    const usuarioSemSenha = this.removerSenha(usuario);
    this.eventEmitter.emit('usuario.criado', usuarioSemSenha);
    return usuarioSemSenha;
  }

  private async validarCriarUsuario(request: UsuarioDto): Promise<void> {
    if (!request.senha) {
      throw new BadRequestException('Informe uma senha');
    }

    if (!request.empresaId && !request.empresaDados) {
      throw new BadRequestException('Informe os dados da empresa');
    }

    if (await this.obterPorEmail(request.email)) {
      throw new BadRequestException('Usuário já cadastrado');
    }
  }

  private async validarEmpresaEPermissoes(request: UsuarioDto): Promise<void> {
    if (!request.empresaId && request.empresaDados) {
      const empresa = await this.empresaService.criar(request.empresaDados);
      request.empresaId = empresa.id;
      request.permissoes = [Role.ADMIN];
    }

    if (!request.permissoes || request.permissoes.length == 0) {
      request.permissoes = [Role.USER];
    }
  }

  async editar(id: number, request: UsuarioDto): Promise<any> {
    const usuario = await this.validarEditarUsuario(id, request);

    this.usuarioRepository.merge(usuario, this.removerSenha(usuario));
    return await this.usuarioRepository.save(usuario);
  }

  private async validarEditarUsuario(
    id: number,
    request: UsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.obterPorId(id);
    if (!usuario) {
      throw new BadRequestException(`Usuário com o ID: ${id} não encontrado`);
    }

    if (!request.permissoes || request.permissoes.length == 0) {
      throw new BadRequestException(`Informe ao menos 1 permissão de usuário`);
    }

    return usuario as Usuario;
  }

  async salvarFoto(usuarioId: number, file: Express.Multer.File): Promise<any> {
    const usuario = await this.obterPorId(usuarioId);
    if (!usuario) {
      throw new BadRequestException(
        `Usuário com o ID: ${usuarioId} não encontrado`,
      );
    }

    usuario.foto = `/upload/fotos/${file.filename}`;
    return await this.usuarioRepository.save(usuario);
  }

  async obterTodos(filtro: UsuarioFiltroDto): Promise<UsuarioDto[]> {
    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('usuario')
      .select([
        'usuario.id',
        'usuario.nome',
        'usuario.email',
        'usuario.isAtivo',
        'usuario.empresaId',
      ])
      .where('usuario.empresaId = :empresaId', {
        empresaId: this.getEmpresaId(),
      });

    this.aplicarFiltros(queryBuilder, filtro);

    const itens = await queryBuilder.getMany();
    return plainToInstance(UsuarioDto, itens);
  }

  private aplicarFiltros(
    queryBuilder: SelectQueryBuilder<Usuario>,
    filtro: UsuarioFiltroDto,
  ): void {
    if (filtro?.busca) {
      queryBuilder.andWhere('usuario.nome LIKE :nome', {
        nome: `%${filtro.busca}%`,
      });
    }

    if (filtro?.isAtivo !== undefined) {
      queryBuilder.andWhere('usuario.isAtivo = :isAtivo', {
        isAtivo: filtro.isAtivo,
      });
    }
  }

  async obterPorId(id: number): Promise<any> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.removerSenha(usuario);
  }

  async obterPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ email });
  }

  async remover(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  private removerSenha(usuario: Usuario): DeepPartial<Usuario> {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
