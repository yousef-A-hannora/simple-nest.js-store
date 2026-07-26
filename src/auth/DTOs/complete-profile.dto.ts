import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CompleteProfileDto {
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  phone: string;
}
