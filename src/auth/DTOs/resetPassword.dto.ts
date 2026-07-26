import { IsString, Length } from 'class-validator';

export class resetPassword {
  @IsString()
  @Length(1, 1000)
  resetToken: string;

  @IsString()
  @Length(1, 100)
  newPassword: string;
}
