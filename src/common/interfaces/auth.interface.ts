import type { AUTH_TYPE, CONDITION_TYPE } from '../constants';

export type AuthType = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];
export type AuthCondition =
  (typeof CONDITION_TYPE)[keyof typeof CONDITION_TYPE];
