import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PROFILE_COMPLETE_REQUIRED_KEY } from '../decorators/profile-complete.decorator';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<boolean>(
      IS_PROFILE_COMPLETE_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.profileCompleted) {
      throw new ForbiddenException(
        'Profile incomplete. Please complete your profile before continuing.',
      );
    }

    return true;
  }
}
