import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared';

@Injectable()
export class UserRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(args: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(args);
  }

  findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }
}
