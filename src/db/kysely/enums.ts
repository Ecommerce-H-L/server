export const user_role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type user_role = (typeof user_role)[keyof typeof user_role];
export const order_status = {
  created: 'created',
  payment_pending: 'payment_pending',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;
export type order_status = (typeof order_status)[keyof typeof order_status];
export const payment_method = {
  COD: 'COD',
  card: 'card',
  cash: 'cash',
} as const;
export type payment_method =
  (typeof payment_method)[keyof typeof payment_method];
export const payment_status = {
  unpaid: 'unpaid',
  paid: 'paid',
  payment_processing: 'payment_processing',
  failed: 'failed',
} as const;
export type payment_status =
  (typeof payment_status)[keyof typeof payment_status];
export const reference_type = {
  product_type: 'product_type',
  gift_card: 'gift_card',
  membership: 'membership',
  package: 'package',
} as const;
export type reference_type =
  (typeof reference_type)[keyof typeof reference_type];
