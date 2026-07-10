import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Min,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { roles } from '../user.entity'; // Adjust the import path

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

  @IsOptional()
  @IsEnum(roles)
  userType?: roles;
}
