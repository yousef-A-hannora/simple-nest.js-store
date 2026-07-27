import { Request } from 'express';
import { roles } from '../enums';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: roles;
    profileCompleted: boolean;
  };
}

export interface GoogleProfile {
  oauthId: string;
  provider: string;
  displayName: string;
  email: string;
}

export interface AuthenticatedRequestGoogle extends Request {
  user: GoogleProfile;
}
