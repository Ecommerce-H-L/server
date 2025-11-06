import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionAction, PermissionFeature } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import type { TokenPayload } from '@/common';
import {
  ActiveUser,
  Auth,
  AUTH_TYPE,
  AuthenticationGuard,
  Permissions,
  RbacGuard,
} from '@/common';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@UseGuards(AuthenticationGuard, RbacGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@ApiBearerAuth()
@Auth(AUTH_TYPE.BEARER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'User created',
  })
  async create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    const result = await this.userService.create(dto);
    return plainToInstance(UserEntity, result);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.LIST,
  })
  @Get()
  @Patch(':id')
  @ApiOkResponse({
    type: UserEntity,
    isArray: true,
    description: 'List of users',
  })
  async findAll(): Promise<UserEntity[]> {
    const result = await this.userService.findAll();
    return plainToInstance(UserEntity, result);
  }

  @Get('me')
  @ApiOkResponse({
    description: 'Currently authenticated token payload',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        iat: { type: 'number' },
        exp: { type: 'number' },
      },
    },
  })
  async getCurrent(@ActiveUser('user') user: TokenPayload['user']) {
    const result = await this.userService.findOne(user.id);
    return plainToInstance(UserEntity, result);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.READ,
  })
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserEntity, description: 'User found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    const result = await this.userService.findOne(id);
    return plainToInstance(UserEntity, result);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserEntity, description: 'Updated user' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const result = await this.userService.update(id, dto);
    return plainToInstance(UserEntity, result);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.DELETE,
  })
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: UserEntity, description: 'Deleted user' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    const result = await this.userService.remove(id);
    return plainToInstance(UserEntity, result);
  }
}
