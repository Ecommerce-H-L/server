import z from 'zod';

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

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
