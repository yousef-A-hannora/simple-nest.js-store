import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 200)
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
