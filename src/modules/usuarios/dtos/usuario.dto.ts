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
import { Role } from 'src/common/constants/roles';
import { IsCPF } from 'src/common/decorators/is-cpf.decorator';
import { EmpresaDto } from 'src/modules/empresas/dtos/empresa.dto';

export class UsuarioDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmpresaDto)
  empresaDados?: EmpresaDto;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  @IsCPF()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  senha: string;

  @IsOptional()
  @IsBoolean()
  isAtivo?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  permissoes?: Role[] = [];
}
