import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { IsCNPJ } from 'src/common/decorators/is-cnpj.decorator';

export class EmpresaDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fantasia: string;

  @IsNotEmpty()
  @IsString()
  @IsCNPJ()
  @ApiProperty()
  cnpj: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty()
  telefonePrimario: string;
}
