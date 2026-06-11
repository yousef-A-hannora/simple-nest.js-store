/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
