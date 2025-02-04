import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserEntity } from 'src/core/database/entities/user.entity';

/**
 * JwtStrategy is responsible for handling JWT authentication
 * using Passport.js.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Constructor initializes the strategy with JWT settings.
   *
   * @param userRepository - Handles user retrieval from the database.
   * @param configService - Provides access to application environment variables.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the associated user.
   *
   * @param payload - The decoded JWT payload containing the user identifier.
   * @returns The authenticated user entity if validation succeeds.
   * @throws UnauthorizedException if the user is not found.
   */
  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}
