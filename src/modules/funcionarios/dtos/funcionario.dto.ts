import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class FuncionarioDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cpf: string;

  @IsString()
  @ApiProperty()
  rg: string;

  @IsString()
  @ApiProperty()
  crm: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date' })
  dataNascimento: Date;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @ApiProperty()
  telefone: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: true })
  isAtivo?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  especialidadeId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  empresaId: number;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  escalaIds?: number[];
}
