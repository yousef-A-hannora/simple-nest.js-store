/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class authGuardJWT extends AuthGuard('jwt') {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

}

export class authGuardGoogle extends AuthGuard('google') {}
