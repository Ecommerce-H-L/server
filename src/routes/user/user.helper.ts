import type { Prisma } from '@prisma/client';

import type { UserEntity } from './user.entity';

export const BASE_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Record<keyof UserEntity | 'deletedAt', true>;

export const toEntity = (
  user: Prisma.UserGetPayload<{ select: typeof BASE_SELECT }>,
): UserEntity => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt ?? null,
  };
};
