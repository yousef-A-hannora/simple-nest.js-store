/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Length,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
