import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  para: string;

  @IsString()
  @IsNotEmpty()
  assunto: string;

  @IsString()
  @IsOptional()
  texto?: string;

  @IsString()
  @IsOptional()
  html?: string;
}
