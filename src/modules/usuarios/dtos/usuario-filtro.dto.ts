import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { FiltroDto } from 'src/common/dtos/filtro.dto';

export class UsuarioFiltroDto extends FiltroDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAtivo?: boolean;
}
