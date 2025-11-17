import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import {
  EmailAlreadyExistsException,
  UserNotFoundException,
} from '@/common/exceptions';
import {
  HashingService,
  LoggerService,
  PrismaService,
} from '@/common/services';
import { isUniqueConstraintPrismaError } from '@/utils';

import { CreateUserDto, UpdateUserDto, UserEntity } from './';
import { BASE_SELECT, toEntity } from './user.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly logger: LoggerService,
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
      this.logger.log('User created successfully', 'UserService');
      return toEntity(created);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        this.logger.error('Email already in use', e.message, 'UserService');
        throw new ConflictException('Email is already in use');
      }
      this.logger.error(
        'Error during user creation',
        e instanceof Error ? e.message : String(e),
        'UserService',
      );
      throw e;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: BASE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    this.logger.log('Fetched all users', 'UserService');
    return users.map(toEntity);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UserService');
      throw new UserNotFoundException(id);
    }
    this.logger.log(`Fetched user: ${id}`, 'UserService');
    return toEntity(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      this.logger.warn(`User not found for update: ${id}`, 'UserService');
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
      this.logger.log(`User updated successfully: ${id}`, 'UserService');
      return toEntity(updated);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        this.logger.error(
          'Email already in use during update',
          e.message,
          'UserService',
        );
        throw new EmailAlreadyExistsException(dto.email);
      }
      this.logger.error(
        'Error during user update',
        e instanceof Error ? e.message : String(e),
        'UserService',
      );
      throw e;
    }
  }

  async remove(id: string): Promise<UserEntity> {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!existing) {
      this.logger.warn(`User not found for deletion: ${id}`, 'UserService');
      throw new UserNotFoundException(id);
    }

    const removed = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: BASE_SELECT,
    });
    this.logger.log(`User deleted successfully: ${id}`, 'UserService');
    return toEntity(removed);
  }
}
