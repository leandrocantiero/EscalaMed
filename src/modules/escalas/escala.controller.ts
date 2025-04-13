import { UseInterceptors, Controller, Body, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ContextInterceptor } from "src/common/interceptors/context.interceptor";
import { EscalaService } from "./escala.service";
import { EscalaDto } from "./dtos/escala.dto";
import { Escala } from "./entities/escala.entity";
import { FiltroDto } from "src/common/dtos/filtro.dto";
import { AuthGuard } from "src/common/guards/auth.guard";

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ContextInterceptor)
@Controller('escalas')
export class EscalaController {
    constructor(private readonly escalaService: EscalaService) { }

    @UseGuards(AuthGuard)
    @Post('/criar')
    async criar(@Body() request: EscalaDto): Promise<Escala> {
        return await this.escalaService.criar(request);
    }

    @UseGuards(AuthGuard)
    @Put('/editar/:id')
    async editar(
        @Param('id') id: number,
        @Body() request: EscalaDto,
    ): Promise<any> {
        return await this.escalaService.editar(id, request);
    }

    @UseGuards(AuthGuard)
    @Post('/obter')
    async obterTodos(@Body() request: FiltroDto): Promise<EscalaDto[]> {
        return await this.escalaService.obterTodos(request);
    }

    @UseGuards(AuthGuard)
    @Get('/obter/:id')
    async obterPorId(@Param('id') id: number): Promise<any> {
        return await this.escalaService.obterPorId(id);
    }

    @UseGuards(AuthGuard)
    @Delete('/remover/:id')
    async remover(@Param('id') id: number): Promise<void> {
        return await this.escalaService.remover(id);
    }
}