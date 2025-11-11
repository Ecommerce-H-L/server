import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import {
  EmailAlreadyExistsException,
  UserNotFoundException,
} from '@/common/exceptions';
import { HashingService, PrismaService } from '@/common/services';
import { isUniqueConstraintPrismaError } from '@/utils';

import { CreateUserDto, UpdateUserDto, UserEntity } from './';
import { BASE_SELECT, toEntity } from './user.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const passwordHash = await this.hashingService.hash(dto.password);
    try {
      const created = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          passwordHash,
          role: dto.role ?? UserRole.USER,
        },
        select: BASE_SELECT,
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
      select: BASE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return users.map(toEntity);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return toEntity(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new UserNotFoundException(id);
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await this.hashingService.hash(dto.password);
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
        select: BASE_SELECT,
      });
      return toEntity(updated);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        throw new EmailAlreadyExistsException(dto.email);
      }
      throw e;
    }
  }

  async remove(id: string): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!existing) {
      throw new UserNotFoundException(id);
    }

    const removed = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: BASE_SELECT,
    });
    return toEntity(removed);
  }
}
