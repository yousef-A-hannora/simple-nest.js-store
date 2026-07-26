import { SetMetadata } from '@nestjs/common';

export const IS_PROFILE_COMPLETE_REQUIRED_KEY = 'isProfileCompleteRequired';

export const RequireCompleteProfile = () =>
  SetMetadata(IS_PROFILE_COMPLETE_REQUIRED_KEY, true);
