export const User_FieldEnum = {
  user_id: 'user_id',
  employee_id: 'employee_id',
  first_name: 'first_name',
  last_name: 'last_name',
  role: 'role',
  pending_auth: 'pending_auth',
  email: 'email',
  auth0_sub: 'auth0_sub',
  auth0_metadata: 'auth0_metadata',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
} as const;
export type User_FieldEnum =
  (typeof User_FieldEnum)[keyof typeof User_FieldEnum];

export const User_FieldWithTableEnum = {
  user_id: 'null.user_id',
  employee_id: 'null.employee_id',
  first_name: 'null.first_name',
  last_name: 'null.last_name',
  role: 'null.role',
  pending_auth: 'null.pending_auth',
  email: 'null.email',
  auth0_sub: 'null.auth0_sub',
  auth0_metadata: 'null.auth0_metadata',
  created_at: 'null.created_at',
  updated_at: 'null.updated_at',
  deleted_at: 'null.deleted_at',
} as const;
export type User_FieldWithTableEnum =
  (typeof User_FieldWithTableEnum)[keyof typeof User_FieldWithTableEnum];

export const DB_TableEnum = {
  User: 'User',
} as const;
export type DB_TableEnum = (typeof DB_TableEnum)[keyof typeof DB_TableEnum];
