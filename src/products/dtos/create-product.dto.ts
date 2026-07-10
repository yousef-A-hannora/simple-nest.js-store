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
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
