import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltroDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  busca?: string;
}
