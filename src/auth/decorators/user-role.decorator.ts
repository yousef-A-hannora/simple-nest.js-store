import { SetMetadata } from '@nestjs/common';
import { roles } from '../../utils/enums';

export const Roles = (...roles: roles[]) => SetMetadata('roles', roles);
