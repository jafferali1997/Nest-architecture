import { UserEntity } from 'src/core/database/entities/user.entity';

interface IOAuthName {
  familyName: string;
  givenName: string;
  middleName?: string;
}

export interface IOAuthUser {
  googleId: string;
  email: string | null;
  name: string;
  accessToken: string;
}

export interface IOAuthProfile {
  id: string;
  name: IOAuthName;
  displayName: string;
  accessToken: string;
  emails?: Array<{ value: string }>;
}

export interface ILoginResponse {
  user: UserEntity;
  token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}