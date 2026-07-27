/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class authGuardJWT extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Access token has expired');
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}

export class authGuardGoogle extends AuthGuard('google') {}
