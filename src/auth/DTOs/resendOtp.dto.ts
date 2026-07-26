import { IsEmail, IsEnum, IsString } from 'class-validator';

enum otpType {
  verify = 'verify',
  reset = 'reset',
}

export class resendOTP {
  @IsEmail()
  @IsString()
  email: string;

  @IsEnum(otpType)
  type: 'verify' | 'reset';
}
