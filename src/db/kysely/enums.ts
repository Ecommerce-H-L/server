export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const OrderStatus = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export const PaymentMethod = {
  COD: 'COD',
  CARD: 'CARD',
  CASH: 'CASH',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export const ReferenceType = {
  PRODUCT_TYPE: 'PRODUCT_TYPE',
  GIFT_CARD: 'GIFT_CARD',
  MEMBERSHIP: 'MEMBERSHIP',
  PACKAGE: 'PACKAGE',
} as const;
export type ReferenceType = (typeof ReferenceType)[keyof typeof ReferenceType];
