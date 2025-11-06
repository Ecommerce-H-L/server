import { config } from 'dotenv';
import { z } from 'zod';

config({
  path: '.env',
});

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('3600s'),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  SECRET_API_KEY: z.string().min(1),
  SUPER_ADMIN_PASSWORD: z.string().min(8),
  SUPER_ADMIN_EMAIL: z.email(),
  SUPER_ADMIN_NAME: z.string().min(1),
  ADMIN_EMAIL: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PASSWORD: z.string().min(8),
  USER_EMAIL: z.string(),
  USER_NAME: z.string(),
  USER_PASSWORD: z.string().min(8),
});

export type Env = z.infer<typeof EnvSchema>;
export const validateEnv = (config: Record<string, unknown>) =>
  EnvSchema.safeParse(config);

const configServer = validateEnv(process.env);

if (!configServer.success) {
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
