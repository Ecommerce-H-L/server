import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { UserRole } from './enums';

export type User = {
  user_id: Generated<string>;
  employee_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: Generated<UserRole>;
  pending_auth: Generated<boolean>;
  email: string | null;
  auth0_sub: string | null;
  auth0_metadata: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
};
export type DB = {
  User: User;
};
