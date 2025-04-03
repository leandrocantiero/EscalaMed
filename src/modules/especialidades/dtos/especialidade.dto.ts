import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EspecialidadeDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;
}
