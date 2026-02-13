import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionAction, PermissionFeature } from '@prisma/client';
import { ZodResponse } from 'nestjs-zod';

import type { TokenPayload } from '@/shared';
import {
  ActiveUser,
  Auth,
  AuthenticationGuard,
  AuthType,
  Permissions,
  RbacGuard,
} from '@/shared';

import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetUserParamsDto,
  GetUserResDto,
  GetUsersQueryDto,
  GetUsersResDto,
  UpdateUserBodyDto,
} from './user.dto';
import { CreateUserResType } from './user.model';
import { UserService } from './user.service';

@UseGuards(AuthenticationGuard, RbacGuard)
@ApiTags('users')
@ApiBearerAuth()
@Auth(AuthType.BEARER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ZodResponse({
    status: 201,
    description: 'User created',
    type: CreateUserResDto,
  })
  async create(@Body() body: CreateUserBodyDto): Promise<CreateUserResType> {
    return this.userService.create(body);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.LIST,
  })
  @Get()
  @ZodResponse({ description: 'List of users', type: GetUsersResDto })
  async findAll(@Query() _query: GetUsersQueryDto) {
    return this.userService.findAll();
  }

  @Get('me')
  @ZodResponse({ description: 'Current user', type: GetUserResDto })
  async getCurrent(@ActiveUser('user') user: TokenPayload['user']) {
    return this.userService.findOne(user.id);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.READ,
  })
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ZodResponse({ description: 'User found', type: GetUserResDto })
  async findOne(@Param() params: GetUserParamsDto) {
    return this.userService.findOne(params.id);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ZodResponse({ description: 'Updated user', type: GetUserResDto })
  async update(
    @Param() params: GetUserParamsDto,
    @Body() dto: UpdateUserBodyDto,
  ) {
    return this.userService.update(params.id, dto);
  }

  @Permissions({
    feature: PermissionFeature.USER,
    action: PermissionAction.DELETE,
  })
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ZodResponse({ description: 'Deleted user', type: GetUserResDto })
  async remove(@Param() params: GetUserParamsDto) {
    return this.userService.remove(params.id);
  }
}
