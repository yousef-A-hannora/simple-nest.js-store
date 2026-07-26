import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

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
