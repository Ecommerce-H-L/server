import type { ConditionType } from '../constants';

export type AuthCondition = (typeof ConditionType)[keyof typeof ConditionType];
