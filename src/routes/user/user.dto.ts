import { createZodDto } from 'nestjs-zod';

import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  GetUserResSchema,
  GetUsersQuerySchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
} from './user.model';

// Request DTOs
export class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}
export class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}

export class GetUserParamsDto extends createZodDto(GetUserParamsSchema) {}
export class GetUsersQueryDto extends createZodDto(GetUsersQuerySchema) {}

// Response DTOs (optional, but useful for @ZodResponse / @ZodSerializerDto)
export class GetUserResDto extends createZodDto(GetUserResSchema) {}
export class GetUsersResDto extends createZodDto(GetUsersResSchema) {}

// Optional “semantic aliases” if you like explicit endpoint naming:
export class CreateUserResDto extends GetUserResDto {}
export class UpdateUserResDto extends GetUserResDto {}
export class DeleteUserResDto extends GetUserResDto {}
