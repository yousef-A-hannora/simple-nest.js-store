import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
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
