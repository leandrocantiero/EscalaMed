import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, IsBoolean, IsNotEmpty, IsArray, IsDateString } from "class-validator";
import { StatusEscalaEnum } from "src/common/constants/status-escala.enum";
import { TipoEscalaEnum } from "src/common/constants/tipo-escala.enum";
import { TurnoEnum } from "src/common/constants/turno.enum";

export class EscalaDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    id: number;

    @IsString()
    @ApiProperty()
    nome: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ type: String, format: 'date' })
    dataHoraInicio: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ type: String, format: 'date' })
    dataHoraFim: Date;

    @IsString()
    @ApiProperty()
    turno: TurnoEnum;

    @IsString()
    @ApiProperty()
    tipo: TipoEscalaEnum;

    @IsString()
    @ApiProperty()
    status: StatusEscalaEnum;

    @IsBoolean()
    @ApiProperty()
    isPresencial: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    local?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    observacoes?: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    empresaId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    especialidadeId?: number;

    @IsOptional()
    @IsArray()
    @ApiProperty()
    funcionarioIds?: number[];
}