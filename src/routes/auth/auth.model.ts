import { z } from 'zod';

import { UserRole } from '@/db/kysely/enums';

const emailTransform = (val: string) =>
  val?.toLowerCase()?.normalize('NFKC')?.trim() || val;

const stringTransform = (val: string) => val?.normalize('NFKC')?.trim() || val;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
const noSpacesRegex = /^\S+$/;

export const RegisterBodySchema = z
  .object({
    email: z
      .email('Invalid email address')
      .max(254, 'Email must be at most 254 characters')
      .transform(emailTransform),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(noSpacesRegex, 'Password cannot contain spaces')
      .regex(passwordRegex, 'Include uppercase, lowercase, number, and symbol')
      .transform(stringTransform),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(UserRole),
    confirmedPassword: z.string().transform(stringTransform),
    code: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Confirm password does not match with password',
    path: ['confirmedPassword'],
  });

export const LoginBodySchema = z.object({
  email: z.email('Invalid email address').transform(emailTransform),
  password: z.string().transform(stringTransform),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const LogoutBodySchema = RefreshTokenSchema;

export const ResetPasswordBodySchema = z
  .object({
    email: z.email('Invalid email address'),
    code: z.string().min(1, 'Verification code is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(noSpacesRegex, 'Password cannot contain spaces')
      .regex(passwordRegex, 'Include uppercase, lowercase, number, and symbol')
      .transform(stringTransform),
    confirmedNewPassword: z.string().transform(stringTransform),
  })
  .refine((data) => data.newPassword === data.confirmedNewPassword, {
    message: 'Confirmed password must match new password',
    path: ['confirmedNewPassword'],
  });

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(['REGISTER', 'RESET_PASSWORD']),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export type RegisterBodyDTO = z.infer<typeof RegisterBodySchema>;
export type LoginBodyDTO = z.infer<typeof LoginBodySchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
export type LogoutBodyDTO = z.infer<typeof LogoutBodySchema>;
export type ResetPasswordBody = z.infer<typeof ResetPasswordBodySchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
