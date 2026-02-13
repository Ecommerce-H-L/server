import { z } from 'zod';

import { UserSchema } from '@/shared/models';

export const stringTransform = (val: string) =>
  val?.normalize('NFKC')?.trim() ?? val;

export const CreateUserBodySchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  role: true,
})
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'confirmPassword must match password',
    path: ['confirmPassword'],
  });

export const GetUserParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export const GetUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const GetUserResSchema = UserSchema.omit({
  password: true,
});

export const GetUsersResSchema = z.array(GetUserResSchema);

export const UpdateUserBodySchema = CreateUserBodySchema.partial()
  .extend({
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const wantsPasswordChange =
      data.password !== undefined || data.confirmPassword !== undefined;

    if (wantsPasswordChange) {
      if (!data.password || !data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'password and confirmPassword are required together',
          path: ['confirmPassword'],
        });
        return;
      }
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'confirmPassword must match password',
          path: ['confirmPassword'],
        });
      }
    }
  });

// GET /users
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>;
export type GetUsersResType = z.infer<typeof GetUsersResSchema>;

// GET /users/{:id}
export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>;
export type GetUserResType = z.infer<typeof GetUserResSchema>;

// POST /users
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
export type CreateUserResType = GetUserResType;

// PUT /users
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
export type UpdateUserResType = GetUserResType;

// DELETE /users/{:id}
export type DeleteUserParamsType = GetUserParamsType;
export type DeleteUserResType = GetUserResType;
