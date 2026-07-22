import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Min,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;
}
