import { Request } from 'express';
import { UserEntity } from 'src/core/database/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: Partial<UserEntity>;
}
