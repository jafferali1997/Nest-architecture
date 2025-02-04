import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthErrors } from 'src/common/constants/auth.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ILoginResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Handles user registration.
   *
   * @param data - The registration details including email and password.
   * @returns A promise resolving to the newly created user entity.
   * @throws ConflictException if the email is already in use.
   */
  async register(data: RegisterDto): Promise<UserEntity> {
    const { Email, Password } = data;

    const user = await this.userRepository.findByField('Email', Email);
    if (user) throw new ConflictException(AuthErrors.EMAIL_IN_USE);

    const hashPassword = await this.userRepository.hashPassword(Password);

    const savedUser = await this.userRepository.saveEntity({
      ...data,
      Password: hashPassword,
    } as unknown as UserEntity);

    return this.userRepository.findById(savedUser.Id);
  }

  /**
   * Handles user login.
   *
   * @param data - The login credentials including email and password.
   * @returns A promise resolving to an object containing the authenticated user and JWT token.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async login(data: LoginDto): Promise<ILoginResponse> {
    const { Email, Password } = data;

    const user = await this.userRepository.findByField('Email', Email);
    if (!user) throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);

    const matchedPassword = await this.userRepository.comparePassword(Password, user.Password);
    if (!matchedPassword) throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);

    const token = await this.userRepository.generateAccessToken(user);

    const savedUser = await this.userRepository.findById(user.Id);
    return { user: savedUser, token };
  }
}
