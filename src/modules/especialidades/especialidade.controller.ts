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
import { EspecialidadeService } from './especialidade.service';
import { EspecialidadeDto } from './dtos/especialidade.dto';
import { Especialidade } from './entities/especialidade.entity';
import { FiltroDto } from 'src/common/dtos/filtro.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ContextInterceptor } from 'src/common/interceptors/context.interceptor';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ContextInterceptor)
@Controller('especialidades')
export class EspecialidadeController {
  constructor(private readonly especialidadeService: EspecialidadeService) {}

  @UseGuards(AuthGuard)
  @Post('/criar')
  async criar(@Body() request: EspecialidadeDto): Promise<Especialidade> {
    return await this.especialidadeService.criar(request);
  }

  @UseGuards(AuthGuard)
  @Put('/editar/:id')
  async editar(
    @Param('id') id: number,
    @Body() request: EspecialidadeDto,
  ): Promise<any> {
    return await this.especialidadeService.editar(id, request);
  }

  @UseGuards(AuthGuard)
  @Post('/obter')
  async obterTodos(@Body() request: FiltroDto): Promise<EspecialidadeDto[]> {
    return await this.especialidadeService.obterTodos(request);
  }

  @UseGuards(AuthGuard)
  @Get('/obter/:id')
  async obterPorId(@Param('id') id: number): Promise<any> {
    return await this.especialidadeService.obterPorId(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/remover/:id')
  async remover(@Param('id') id: number): Promise<void> {
    return await this.especialidadeService.remover(id);
  }
}
