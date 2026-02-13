import { UserRole } from '@prisma/client';
import { z } from 'zod';

import { stringTransform } from '@/routes/user/user.model';

const emailTransform = (val: string) =>
  val?.toLowerCase()?.normalize('NFKC')?.trim() ?? val;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
const noSpacesRegex = /^\S+$/;

export const UserSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z
    .email('Invalid email address')
    .max(254, 'Email must be at most 254 characters')
    .transform(emailTransform),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(200, 'Password must be at most 200 characters')
    .regex(noSpacesRegex, 'Password cannot contain spaces')
    .regex(
      passwordRegex,
      'Password must include uppercase, lowercase, number, and symbol',
    )
    .transform(stringTransform),
  role: z.enum(UserRole).optional(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
