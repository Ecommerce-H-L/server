import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/common';
import { isUniqueConstraintPrismaError } from '@/utils';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserEntity } from './user.entity';

function toEntity(
  user: Prisma.UserGetPayload<{ select: typeof baseSelect }>,
): UserEntity {
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
}

const baseSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Record<keyof UserEntity | 'deletedAt', true>;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const created = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          passwordHash,
          role: dto.role ?? UserRole.USER,
        },
        select: baseSelect,
      });
      return toEntity(created);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        throw new ConflictException('Email is already in use');
      }
      throw e;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: baseSelect,
      orderBy: { createdAt: 'desc' },
    });
    return users.map(toEntity);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: baseSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toEntity(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 12);
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          ...(passwordHash ? { passwordHash } : {}),
          ...(dto.role ? { role: dto.role } : {}),
        },
        select: baseSelect,
      });
      return toEntity(updated);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        throw new ConflictException('Email is already in use');
      }
      throw e;
    }
  }

  async remove(id: string): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: baseSelect,
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const removed = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: baseSelect,
    });
    return toEntity(removed);
  }
}
