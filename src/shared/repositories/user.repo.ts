import { Injectable } from '@nestjs/common';
import { Prisma, RolePermission, User } from '@prisma/client';

import { PrismaService } from '../services';

export type UserIncludeRolePermissionsType = User & {
  permissions: RolePermission[];
};

export type WhereUniqueUserType = Pick<User, 'id'> | Pick<User, 'email'>;

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: WhereUniqueUserType): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async findUniqueIncludeRolePermissions(
    where: WhereUniqueUserType,
  ): Promise<UserIncludeRolePermissionsType | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    if (!user) {
      return null;
    }

    const permissions = await this.prismaService.rolePermission.findMany({
      where: {
        role: user.role,
        deletedAt: null,
      },
    });

    return {
      ...user,
      permissions,
    };
  }

  update(
    data: Partial<User>,
    options: Omit<Prisma.UserUpdateArgs, 'data'>,
  ): Promise<User> {
    const { where, ...restOptions } = options;
    return this.prismaService.user.update({
      ...restOptions,
      where: {
        ...where,
        deletedAt: null,
      },
      data,
    });
  }

  create(
    user: Prisma.UserCreateInput,
    options?: Omit<Prisma.UserCreateArgs, 'data'>,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: user,
      ...options,
    });
  }
}
