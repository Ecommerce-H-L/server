import type { User } from '@prisma/client';

export interface TokenPayload {
  user: Pick<User, 'email' | 'id' | 'firstName' | 'lastName' | 'role'>;
  iat: number;
  exp: number;
}
