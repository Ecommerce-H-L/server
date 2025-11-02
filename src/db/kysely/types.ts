import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ReferenceType,
  UserRole,
} from './enums';

export type Brand = {
  id: string;
  brandName: string;
  description: string | null;
  createdAt: Generated<Timestamp>;
  createdById: string | null;
  updatedById: string | null;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type CartItem = {
  id: string;
  cartSessionId: string;
  referenceId: string;
  referenceType: ReferenceType;
  quantity: Generated<number>;
  note: string | null;
};
export type CartSession = {
  id: string;
  userId: string;
  baseTotalPrice: Generated<string>;
  totalTax: Generated<string>;
};
export type Category = {
  id: string;
  categoryName: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  createdById: string | null;
  updatedById: string | null;
};
export type Order = {
  id: string;
  userId: string;
  orderStatus: Generated<OrderStatus>;
  paymentMethod: Generated<PaymentMethod>;
  paymentStatus: Generated<PaymentStatus>;
  paidAt: Timestamp | null;
  evidencePath: string | null;
  totalTax: Generated<string>;
  baseTotalPrice: Generated<string>;
  totalAmountDue: Generated<string>;
  note: string | null;
  userPhone: string | null;
  userAddress: string | null;
  updatedById: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type OrderItem = {
  id: string;
  orderId: string;
  orderItemName: string;
  referenceId: string;
  referenceType: ReferenceType;
  quantity: Generated<number>;
  price: Generated<string>;
  note: string | null;
};
export type Product = {
  id: string;
  productName: string;
  productType: string;
  price: Generated<string>;
  quantity: Generated<number>;
  usageInstructions: string | null;
  description: string | null;
  ingredients: string | null;
  brandId: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  createdById: string | null;
  updatedById: string | null;
};
export type ProductCategory = {
  id: string;
  productId: string;
  categoryId: string;
  createdAt: Generated<Timestamp>;
  createdById: string | null;
  updatedAt: Timestamp;
  updatedById: string | null;
  deletedAt: Timestamp | null;
};
export type ProductImage = {
  id: string;
  productId: string;
  imagePath: string;
  createdAt: Generated<Timestamp>;
  createdById: string | null;
  updatedAt: Timestamp;
  updatedById: string | null;
  deletedAt: Timestamp | null;
};
export type RefreshToken = {
  token: string;
  userId: string;
  expiredAt: Timestamp;
  createdAt: Generated<Timestamp>;
};
export type RolePermission = {
  rolePermissionId: string;
  role: UserRole;
  permissionFeature: string;
  permissionAction: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: Generated<UserRole>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type UserLocation = {
  id: string;
  userId: string;
  phone: string;
  address: string;
};
export type DB = {
  Brand: Brand;
  CartItem: CartItem;
  CartSession: CartSession;
  Category: Category;
  Order: Order;
  OrderItem: OrderItem;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductImage: ProductImage;
  RefreshToken: RefreshToken;
  RolePermission: RolePermission;
  User: User;
  UserLocation: UserLocation;
};
