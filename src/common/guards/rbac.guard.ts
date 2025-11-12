import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { PermissionAction, PermissionFeature, UserRole } from '@prisma/client';
import { Request } from 'express';

import {
  PERMISSIONS_KEY,
  REQUEST_USER_KEY,
  RequireOption,
} from '@/common/constants';

import { RequiredPermission } from '../decorators';
import { PrismaService } from '../services';

type Meta = { perms: RequiredPermission[]; require: RequireOption };

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<Meta | undefined>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!meta || meta.perms.length === 0) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY].user;
    if (!user) {
      throw new ForbiddenException('No user in request (auth guard missing?)');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    const results = await Promise.all(
      meta.perms.map((p) => this.hasPermission(user.role, p.feature, p.action)),
    );

    const ok =
      meta.require === RequireOption.ALL
        ? results.every(Boolean)
        : results.some(Boolean);
    if (!ok) {
      throw new ForbiddenException(MESSAGES);
    }
    return true;
  }

  private async hasPermission(
    role: UserRole,
    feature: PermissionFeature,
    action: PermissionAction,
  ): Promise<boolean> {
    const found = await this.prisma.rolePermission.findFirst({
      where: {
        role,
        permissionFeature: feature,
        OR: [
          { permissionAction: action },
          { permissionAction: PermissionAction.MANAGE },
        ],
      },
      select: { rolePermissionId: true },
    });
    return !!found;
  }
}
