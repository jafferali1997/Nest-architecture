import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

/**
 * AuthController handles authentication-related endpoints, including
 * user registration and login.
 */
@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user registration.
   *
   * @param body - The request body containing user registration details.
   * @returns A response indicating successful user registration.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register your account' })
  async register(@Body() body: RegisterDto): Promise<ApiResponse<UserEntity>> {
    const response = await this.authService.register(body);
    return new ApiResponse(true, HttpStatus.CREATED, 'User registered successfully', response);
  }

  /**
   * Handles user login.
   *
   * @param body - The request body containing user login credentials.
   * @returns A response containing the authentication token and user details.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login into your account' })
  async login(@Body() body: LoginDto) {
    const response = await this.authService.login(body);
    return new ApiResponse(true, HttpStatus.OK, 'User logged in successfully', response);
  }
}
