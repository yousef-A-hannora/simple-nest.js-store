import { IsEmail, IsString } from 'class-validator';

export class sendResetOTP {
  @IsEmail()
  @IsString()
  email: string;
}
