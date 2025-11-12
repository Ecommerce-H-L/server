import { SetMetadata } from '@nestjs/common';
import type { PermissionAction, PermissionFeature } from '@prisma/client';

import { PERMISSIONS_KEY, RequireOption } from '../constants';

export interface PermissionsDecorator {
  perms: RequiredPermission[];
  require: RequireOption;
}

export type RequiredPermission = {
  feature: PermissionFeature;
  action: PermissionAction;
};

export type PermissionsOptions = {
  require?: RequireOption;
};

export function Permissions(
  perms: RequiredPermission,
): ReturnType<typeof SetMetadata>;

export function Permissions(
  perms: RequiredPermission[],
  options: PermissionsOptions,
): ReturnType<typeof SetMetadata>;

export function Permissions(
  perms: RequiredPermission[] | RequiredPermission,
  options?: PermissionsOptions,
) {
  const value = Array.isArray(perms) ? perms : [perms];
  return SetMetadata(PERMISSIONS_KEY, {
    perms: value,
    require: options?.require ?? RequireOption.ANY,
  });
}
