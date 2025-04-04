import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FiltroDto } from 'src/common/dtos/filtro.dto';
import { EmpresaService } from './empresa.service';
import { EmpresaDto } from './dtos/empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ContextInterceptor } from 'src/common/interceptors/context.interceptor';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ContextInterceptor)
@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @UseGuards(AuthGuard)
  @Post('/criar')
  async criar(@Body() request: EmpresaDto): Promise<Empresa> {
    return await this.empresaService.criar(request);
  }

  @UseGuards(AuthGuard)
  @Put('/editar/:id')
  async editar(
    @Param('id') id: number,
    @Body() request: EmpresaDto,
  ): Promise<any> {
    return await this.empresaService.editar(id, request);
  }

  @UseGuards(AuthGuard)
  @Post('/obter')
  async obterTodos(@Body() request: FiltroDto): Promise<EmpresaDto[]> {
    return await this.empresaService.obterTodos(request);
  }

  @UseGuards(AuthGuard)
  @Get('/obter/:id')
  async obterPorId(@Param('id') id: number): Promise<any> {
    return await this.empresaService.obterPorId(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/remover/:id')
  async remover(@Param('id') id: number): Promise<void> {
    return await this.empresaService.remover(id);
  }
}
