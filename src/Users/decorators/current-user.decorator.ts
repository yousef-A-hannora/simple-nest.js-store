/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { roles } from '../../utils/enums';

export type JWTPayload = {
  Id: number;
  role: roles;
  profileCompleted: boolean;
};

export const currentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JWTPayload = request['user'];
    return user;
  },
);
