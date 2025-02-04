import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { IOAuthProfile } from '../interfaces/auth.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    // Pass the configuration values to the Passport strategy
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      profileFields: ['id', 'name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: IOAuthProfile) {
    // Validate the user based on the profile received from Facebook
    const user = {
      facebookId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      accessToken,
    };

    // const existingUser = await this.authService.validateUserByFacebookId(user.facebookId);
    // if (!existingUser) {
    //   // If user doesn't exist, create a new user
    //   const newUser = await this.authService.createUserFromFacebook(user);
    //   return newUser;
    // }

    // If user exists, return the existing user
    // return existingUser;
  }
}
