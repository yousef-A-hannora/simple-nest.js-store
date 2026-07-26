/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID') || 'id',
      clientSecret: config.get('GOOGLE_CLIENT_SECRET') || 'secret',
      callbackURL: config.get('GOOGLE_CALLBACK') || 'call back',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    return {
      oauthId: profile.id,
      provider: 'google',
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value,
    };
  }
}
