import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FuncionarioDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  nome: string;
}
