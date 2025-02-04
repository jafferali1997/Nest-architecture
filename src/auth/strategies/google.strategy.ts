import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { IOAuthProfile, IOAuthUser } from '../interfaces/auth.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService // Inject ConfigService
  ) {
    // Directly use configService.get() in the super call
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  //   async validate(
  //     accessToken: string,
  //     refreshToken: string,
  //     profile: IOAuthProfile,
  //   ): Promise<IOAuthUser> {
  //     const user: IOAuthUser = {
  //       googleId: profile.id,
  //       email: profile.emails?.[0]?.value || null,
  //       name: profile.displayName,
  //       accessToken,
  //     };

  //     // Call the OAuth login method and return the result
  //     return this.authService.oauthLogin(user);
  //   }
}
