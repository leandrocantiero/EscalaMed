import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { UsuarioService } from 'src/modules/usuarios/usuario.service';
import { UsuarioDto } from './dtos/usuario.dto';
import { UsuarioFiltroDto } from './dtos/usuario.filter.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Role } from 'src/common/constants/roles';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/config/multer-config';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard)
  @Post('/criar')
  async criar(@Body() request: UsuarioDto): Promise<any> {
    return await this.usuarioService.criar(request);
  }

  @UseGuards(AuthGuard)
  @Put('/editar/:id')
  async editar(
    @Param('id') id: number,
    @Body() request: UsuarioDto,
  ): Promise<any> {
    return await this.usuarioService.editar(id, request);
  }

  @UseGuards(AuthGuard)
  @Post('/upload/foto/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFoto(
    usuarioId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.usuarioService.salvarFoto(usuarioId, file);
  }

  @UseGuards(AuthGuard)
  @Post('/obter')
  async obterTodos(@Body() request: UsuarioFiltroDto): Promise<UsuarioDto[]> {
    return await this.usuarioService.obterTodos(request);
  }

  @UseGuards(AuthGuard)
  @Get('/obter/:id')
  async obterPorId(@Param('id') id: number): Promise<any> {
    return await this.usuarioService.obterPorId(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/remover/:id')
  async remover(@Param('id') id: number): Promise<void> {
    return await this.usuarioService.remover(id);
  }

  @UseGuards(AuthGuard)
  @Get('/permissoes')
  obterPermissoes(): string[] {
    return Object.values(Role);
  }
}
