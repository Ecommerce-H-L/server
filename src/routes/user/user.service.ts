import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import {
  EmailAlreadyExistsException,
  UserNotFoundException,
} from '@/shared/exceptions';
import { SharedUserRepository } from '@/shared/repositories';
import { HashingService, LoggerService } from '@/shared/services';
import { isUniqueConstraintPrismaError } from '@/utils';

import {
  CreateUserBodyDto,
  DeleteUserResDto,
  GetUserResDto,
  GetUsersResDto,
  UpdateUserBodyDto,
  UpdateUserResDto,
} from './user.dto';
import { BASE_SELECT, toEntity } from './user.helper';
import { CreateUserResType } from './user.model';
import { UserRepo } from './user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly logger: LoggerService,
    private readonly userRepo: UserRepo,
    private readonly sharedUserRepo: SharedUserRepository,
  ) {}

  async create(body: CreateUserBodyDto): Promise<CreateUserResType> {
    const passwordHash = await this.hashingService.hash(body.password);
    try {
      const user = await this.sharedUserRepo.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        passwordHash,
        role: body.role ?? UserRole.USER,
      });

      this.logger.log('User created successfully', 'UserService');
      return user;
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

  async findAll(): Promise<GetUsersResDto> {
    const users = await this.userRepo.findMany({
      where: { deletedAt: null },
      select: BASE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    this.logger.log('Fetched all users', 'UserService');
    return users;
  }

  async findOne(id: string): Promise<GetUserResDto> {
    const user = await this.userRepo.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UserService');
      throw new UserNotFoundException(id);
    }
    this.logger.log(`Fetched user: ${id}`, 'UserService');
    return user;
  }

  async update(id: string, body: UpdateUserBodyDto): Promise<UpdateUserResDto> {
    const existing = await this.userRepo.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      this.logger.warn(`User not found for update: ${id}`, 'UserService');
      throw new UserNotFoundException(id);
    }

    let passwordHash: string | undefined;
    if (body.password) {
      passwordHash = await this.hashingService.hash(body.password);
    }

    try {
      const updated = await this.sharedUserRepo.update(
        {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          ...(passwordHash ? { passwordHash } : {}),
          ...(body.role ? { role: body.role } : {}),
        },
        {
          where: { id },
          select: BASE_SELECT,
        },
      );
      this.logger.log(`User updated successfully: ${id}`, 'UserService');
      return toEntity(updated);
    } catch (e) {
      if (isUniqueConstraintPrismaError(e)) {
        this.logger.error(
          'Email already in use during update',
          e.message,
          'UserService',
        );
        throw new EmailAlreadyExistsException(body.email);
      }
      this.logger.error(
        'Error during user update',
        e instanceof Error ? e.message : String(e),
        'UserService',
      );
      throw e;
    }
  }

  async remove(id: string): Promise<DeleteUserResDto> {
    const existing = await this.userRepo.findFirst({
      where: { id, deletedAt: null },
      select: BASE_SELECT,
    });
    if (!existing) {
      this.logger.warn(`User not found for deletion: ${id}`, 'UserService');
      throw new UserNotFoundException(id);
    }

    const user = await this.sharedUserRepo.update(
      { deletedAt: new Date() },
      { where: { id }, select: BASE_SELECT },
    );
    this.logger.log(`User deleted successfully: ${id}`, 'UserService');
    return user;
  }
}
