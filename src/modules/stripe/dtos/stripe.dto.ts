import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StripeDto {
  @IsNumber()
  @ApiProperty()
  empresaId: number;

  @IsString()
  @ApiProperty()
  priceId: string;
}
