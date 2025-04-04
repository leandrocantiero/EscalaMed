import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FiltroDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  nome?: string;
}
