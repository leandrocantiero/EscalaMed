import { IsBoolean, IsOptional } from 'class-validator';
import { FiltroDto } from 'src/common/dtos/filter.dto';

export class UsuarioFiltroDto extends FiltroDto {
  @IsOptional()
  @IsBoolean()
  isAtivo?: boolean;
}
