import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FiltroDto } from 'src/common/dtos/filter.dto';
import { FuncionarioDto } from './dtos/funcionario.dto';
import { Funcionario } from './entities/funcionario.entity';
import { FuncionarioService } from './funcionario.service';

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @UseGuards(AuthGuard)
  @Post('/criar')
  async criar(@Body() request: FuncionarioDto): Promise<Funcionario> {
    return await this.funcionarioService.criar(request);
  }

  @UseGuards(AuthGuard)
  @Put('/editar/:id')
  async editar(
    @Param('id') id: number,
    @Body() request: FuncionarioDto,
  ): Promise<any> {
    return await this.funcionarioService.editar(id, request);
  }

  @UseGuards(AuthGuard)
  @Post('/obter')
  async obterTodos(@Body() request: FiltroDto): Promise<FuncionarioDto[]> {
    return await this.funcionarioService.obterTodos(request);
  }

  @UseGuards(AuthGuard)
  @Get('/obter/:id')
  async obterPorId(@Param('id') id: number): Promise<any> {
    return await this.funcionarioService.obterPorId(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/remover/:id')
  async remover(@Param('id') id: number): Promise<void> {
    return await this.funcionarioService.remover(id);
  }
}
