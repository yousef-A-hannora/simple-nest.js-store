import { IsEmail, IsEnum, IsNumber, IsString, Max } from 'class-validator';

enum otpType {
  verify = 'verify',
  reset = 'reset',
}

export class verifyOTP {
  @IsEmail()
  @IsString()
  email: string;

  @IsNumber()
  @Max(10000000)
  otp: number;

  @IsEnum(otpType)
  type: 'verify' | 'reset';
}
