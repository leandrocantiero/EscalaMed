import { IsNumber } from 'class-validator';

export class StorageDto {
  @IsNumber()
  public usuario?: any;
}
