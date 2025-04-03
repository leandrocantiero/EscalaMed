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
  id?: number;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  fantasia: string;

  @IsNotEmpty()
  @IsString()
  @IsCNPJ()
  cnpj: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  telefonePrimario: string;
}
