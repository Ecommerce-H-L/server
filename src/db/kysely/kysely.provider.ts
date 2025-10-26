import type { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { Env } from '@/config/env';

import type { DB } from './types';

export const KyselyProvider = {
  provide: 'DB',
  useFactory: (config: ConfigService<Env, true>) =>
    new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: config.get('DATABASE_URL', { infer: true }),
        }),
      }),
    }),
};
