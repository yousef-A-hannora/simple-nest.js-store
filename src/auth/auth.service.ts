/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as JWT from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { User } from '../Users/user.entity';
import { redisClient } from '../utils/redis';
import { UsersService } from '../Users/Users.service';
import { LoginDto } from './DTOs/login.dto';
import { CreateUserDto } from '../Users/DTOs/create-user-dto';
import { GoogleProfile } from '../Interfaces/AuthRequest';
type OTPType = 'verify' | 'reset';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(auth) private readonly authRepository: Repository<auth>,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  public async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = randomBytes(64).toString('hex');
    const tokenId = randomBytes(16).toString('hex');
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    const authToken = this.authRepository.create({
      refreshToken: hashedRefreshToken,
      tokenId: tokenId,
      expiresAt: new Date(
        Date.now() +
          (this.configService.get<number>('REFRESH_TOKEN_EXPIRATION') || 30) *
            1000 *
            86400,
      ), // Convert seconds to milliseconds
      user: user,
    });
    await this.authRepository.save(authToken);
    return `${tokenId}.${refreshToken}`; // Return both the refresh token and token ID
  }

  public async revokeAuthToken(refreshToken: string): Promise<void> {
    const [valed, token] = await this.validateRefreshToken(refreshToken);
    if (!valed || !token) {
      throw new HttpException('Invalid refresh token', 401);
    }
    if (valed) {
      await this.authRepository.update(
        { tokenId: token.tokenId },
        { revoked: true },
      );
    } else {
      throw new HttpException('Invalid refresh token', 401);
    }
  }

  public async revokeAllAuthTokensForUser(refreshToken: string): Promise<void> {
    const [valid, data] = await this.validateRefreshToken(refreshToken);
    if (!valid) {
      throw new HttpException('Token not valed of expired', 400);
    }
    await this.authRepository.update(
      {
        user: {
          id: data?.user.id,
        },
      },
      {
        revoked: true,
      },
    );
  }

  public async generateAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const [isValid, authToken] = await this.validateRefreshToken(refreshToken);
    if (isValid && authToken) {
      return this.generateAccessToken(authToken.user);
    } else {
      throw new HttpException('Invalid or expired refresh token', 401);
    }
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<[accessToken: string, refreshToken: string]> {
    const user = await this.userService.getOneBy(loginDto.email, true);
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.profileCompleted) {
      throw new HttpException(
        'Profile incomplete. Please complete your profile to login.',
        HttpStatus.FORBIDDEN,
      );
    }

    const refreshToken = await this.generateRefreshToken(user);

    const accessToken = this.generateAccessToken(user);

    return [accessToken, refreshToken];
  }

  public async storeSignupSession(user: Partial<User>) {
    try {
      if (await redisClient.get(`pendingSignup_${user.email}`)) {
        throw new HttpException('this account is already pending verify', 400);
      }
      await redisClient.set(
        `pendingSignup_${user.email}`,
        JSON.stringify(user),
        { expiration: { type: 'EX', value: 300 } },
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error(err);
    }
  }

  public async restoreSignupSession(
    email: string,
  ): Promise<CreateUserDto | null> {
    try {
      const userString: string | null = await redisClient.get(
        `pendingSignup_${email}`,
      );
      const user: CreateUserDto = JSON.parse(userString!);
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // -----------------------password reset flow
  public async issueResetToken(email: string): Promise<string> {
    const resetToken = randomBytes(32).toString('hex');
    await redisClient.set(`reset-token:${resetToken}`, email, { EX: 300 }); // 5 min
    return resetToken;
  }

  public async consumeResetToken(resetToken: string): Promise<string> {
    const email = await redisClient.get(`reset-token:${resetToken}`);
    if (!email) {
      throw new HttpException(
        'Reset session expired, request a new OTP',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await redisClient.del(`reset-token:${resetToken}`); // one-time use
    return email;
  }
  //-------------------------OTP-------------------------

  public async generateOTPForUser(
    email: string,
    type: OTPType,
  ): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    const otpKey = `${type}:user:${email}`;
    const otpAttemptKey = `${type}_attempt:user:${email}`;

    await redisClient.set(otpKey, otp, {
      EX: 300,
    });

    await redisClient.set(otpAttemptKey, 0, {
      EX: 300,
    });

    return otp;
  }

  public async verifyOTP(
    email: string,
    otp: number,
    type: OTPType,
  ): Promise<boolean> {
    const otpKey = `${type}:user:${email}`;
    const otpAttemptKey = `${type}_attempt:user:${email}`;
    const storedOTP = await redisClient.get(otpKey);
    const attempts = Number((await redisClient.get(otpAttemptKey)) ?? 0);
    if (attempts >= 5) {
      throw new HttpException(
        'Too many attempts, request a new OTP',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!storedOTP || storedOTP !== otp.toString()) {
      await redisClient.incr(otpAttemptKey);
      return false;
    }

    await redisClient.del(otpKey);
    await redisClient.del(otpAttemptKey);

    return true;
  }

  public async regenerateOTP(
    email: string,
    type: OTPType = 'verify',
  ): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    const otpKey = `${type}:user:${email}`;
    const otpAttemptKey = `${type}_attempt:user:${email}`;

    const otpResendKey = `${type}_resend:user:${email}`;
    const reset = await redisClient.get(otpResendKey);
    if (reset) {
      throw new HttpException(
        'Too many attempts, wait 1 minute',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await redisClient.set(otpKey, otp, {
      EX: 300,
    });

    await redisClient.set(otpAttemptKey, 0, {
      EX: 300,
    });

    await redisClient.set(otpResendKey, 0, {
      EX: 60,
    });

    return otp;
  }

  //-----------------Helper Methods-----------------

  private generateAccessToken(user: User): string {
    const payload = {
      Id: user.id,
      roles: user.userType,
      profileCompleted: user.profileCompleted,
    };

    const secret =
      this.configService.get<string>('JWT_SECRET') || 'defaultSecret'; // Default secret if not set
    const expiresIn: number =
      Number(
        this.configService.get<string>('ACCESS_TOKEN_EXPIRATION_IN_MINUTES'),
      ) || 15 * 60 * 1000; // Default to 15 minutes if not set

    const accessToken = JWT.sign(payload, secret, { expiresIn });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return accessToken;
  }

  private async validateRefreshToken(
    refreshToken: string,
  ): Promise<[boolean, auth | null]> {
    const [tokenId, token] = refreshToken.split('.');
    if (!token || !tokenId) {
      throw new HttpException('Invalid refresh token format', 400);
    }
    const secretToken = await this.authRepository.findOne({
      where: { tokenId },
      select: {
        user: true,
        tokenId: true,
        expiresAt: true,
        refreshToken: true,
        revoked: true,
      },
      relations: { user: true },
    });
    if (!secretToken) {
      throw new HttpException('Refresh token not found', 404);
    }
    const IsMatch = await bcrypt.compare(
      token,
      secretToken?.refreshToken || '',
    );
    if (IsMatch && secretToken?.expiresAt > new Date() && !secretToken.revoked)
      return [true, secretToken];
    return [false, null];
  }

  public async handleGoogleLogin(profile: GoogleProfile): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    profileCompleted: boolean;
  }> {
    let user = await this.userService.findByOAuthId(profile.oauthId);

    if (!user) {
      user = await this.userService.findByEmail(profile.email);
      if (user) {
        await this.userService.updateInternal(
          { oauthId: profile.oauthId, provider: profile.provider },
          user.id,
        );
      } else {
        user = await this.userService.createOAuthUser({
          name: profile.displayName,
          email: profile.email,
          oauthId: profile.oauthId,
          provider: profile.provider,
        });
      }
    }

    const refreshToken = await this.generateRefreshToken(user);
    const accessToken = this.generateAccessToken(user);

    return {
      user,
      accessToken,
      refreshToken,
      profileCompleted: user.profileCompleted,
    };
  }

  public async completeProfile(
    userId: number,
    birthDate: Date,
    phone: string,
  ): Promise<void> {
    try {
      const user = await this.userService.completeProfile(
        userId,
        birthDate,
        phone,
      );
    } catch (err) {
      throw new HttpException('Failed to complete profile, try again', 500);
    }
  }
}
