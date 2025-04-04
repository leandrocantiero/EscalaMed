import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FuncionarioDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome: string;
}
