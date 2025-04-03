import { IsOptional, IsString } from 'class-validator';

export class FiltroDto {
  @IsOptional()
  @IsString()
  nome?: string;
}
