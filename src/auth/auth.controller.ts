import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './DTOs/login.dto';
import { CompleteProfileDto } from './DTOs/complete-profile.dto';
import type { Response, Request } from 'express';
import { UsersService } from '../Users/Users.service';
import { CreateUserDto } from '../Users/DTOs/create-user-dto';
import { authGuardGoogle, authGuardJWT } from './guards/auth.guard';
import type {
  AuthenticatedRequest,
  AuthenticatedRequestGoogle,
} from '../utils/Interfaces/AuthRequest';
import { verifyOTP } from './DTOs/verifyOtp.dto';
import { resendOTP } from './DTOs/resendOtp.dto';
import { resetPassword } from './DTOs/resetPassword.dto';
import { sendResetOTP } from './DTOs/sendResetOTP.dto';
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Exchange a refresh token for a new access token.
   */
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const accessToken =
      await this.authService.generateAccessTokenByRefreshToken(
        String(req.cookies.refreshtoken),
      );

    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const [accessToken, refreshToken] = await this.authService.login(loginDto);
    response.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: accessToken };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ValidationPipe()) signupDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.storeSignupSession(signupDto);
    await this.authService.generateOTPForUser(signupDto.email, 'verify');
    return { message: 'Acount created, waiting verification ' };
  }

  @Get('google')
  @UseGuards(authGuardGoogle)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(authGuardGoogle)
  async googleCallback(
    @Req() req: AuthenticatedRequestGoogle,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleGoogleLogin(req.user);

    res.cookie('refreshtoken', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    if (!result.profileCompleted) {
      return res.redirect(`${frontendUrl}/complete-profile`);
    }

    return res.json({ accessToken: result.accessToken });
  }

  @Patch('complete-profile')
  @UseGuards(authGuardJWT)
  async completeProfile(
    @Body(new ValidationPipe()) dto: CompleteProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.authService.completeProfile(
      req.user.id,
      new Date(dto.birthDate),
      dto.phone,
    );

    return { message: 'Profile completed successfully' };
  }
  /**
   * Logout from the current device.
   */
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: string = req.cookies.refreshtoken;

    if (!token) {
      return { message: 'You need to login first' };
    }

    await this.authService.revokeAuthToken(token);

    res.clearCookie('refreshtoken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices.
   */
  @Get('/logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<{ message: string }> {
    if (!request.cookies.refreshtoken) {
      throw new HttpException('You need to log in first', 401);
    }
    await this.authService.revokeAllAuthTokensForUser(
      String(request.cookies.refreshtoken),
    );
    res.clearCookie('refreshtoken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  /**
   * Send a password reset OTP.
   */
  @Post('/forget-pasword')
  async sendResetOtp(@Body() body: sendResetOTP): Promise<{ message: string }> {
    const otp = await this.authService.generateOTPForUser(body.email, 'reset');
    console.log(otp);
    return { message: 'OTP sent to your email' };
  }

  /**
   * Verify OTP.
   */
  @Post('verify-otp')
  async verifyOtp(
    @Body()
    body: verifyOTP,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ result: string }> {
    const success = await this.authService.verifyOTP(
      body.email,
      body.otp,
      body.type ?? 'verify',
    );

    if (success && body.type === 'verify') {
      try {
        const signupData = await this.authService.restoreSignupSession(
          body.email,
        );
        if (!signupData) {
          throw new HttpException('User not found, signup again', 404);
        }
        const user = await this.userService.create(signupData);

        //create a token for the user
        const refreshToken = await this.authService.generateRefreshToken(user);
        const accessToken =
          await this.authService.generateAccessTokenByRefreshToken(
            refreshToken,
          );
        //send it to user
        response.cookie('refreshtoken', refreshToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return { result: accessToken };
      } catch (err) {
        if (err instanceof HttpException) throw err;
        console.error(err);
        throw new HttpException('something went wrong, try login again', 500);
      }
    }
    if (success && body.type === 'reset') {
      const resetToken = await this.authService.issueResetToken(body.email);
      return { result: resetToken };
    }
    return { result: String(success) };
  }

  /**
   * Resend OTP.
   */
  @Post('resend-otp')
  async resendOtp(
    @Body()
    body: resendOTP,
  ): Promise<{ message: string }> {
    await this.authService.regenerateOTP(body.email, body.type ?? 'verify');

    return { message: 'OTP sent to your email' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: resetPassword) {
    await this.authService.resetPassword(body.resetToken, body.newPassword);
    return { message: 'Password updated successfully' };
  }
}
