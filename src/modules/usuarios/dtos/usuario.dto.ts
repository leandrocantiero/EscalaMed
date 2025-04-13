import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/common/constants/roles.enum';
import { IsCPF } from 'src/common/decorators/is-cpf.decorator';
import { EmpresaDto } from 'src/modules/empresas/dtos/empresa.dto';

export class UsuarioDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  empresaId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmpresaDto)
  @ApiProperty()
  empresaDados?: EmpresaDto;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome: string;

  @IsOptional()
  @IsString()
  @IsCPF()
  @ApiProperty()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  senha: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAtivo?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty()
  permissoes?: Role[] = [];
}
