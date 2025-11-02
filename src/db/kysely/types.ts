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
  brandId: string;
  brandName: string;
  description: string | null;
  createdAt: Generated<Timestamp>;
  createdById: string | null;
  updatedById: string | null;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type CartItem = {
  cartItemId: string;
  cartSessionId: string;
  referenceId: string;
  referenceType: ReferenceType;
  quantity: number;
  note: string | null;
};
export type CartSession = {
  cartSessionId: string;
  userId: string;
  baseTotalPrice: string;
  totalTax: string;
};
export type Category = {
  categoryId: string;
  categoryName: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  createdById: string | null;
  updatedById: string | null;
};
export type Order = {
  orderId: string;
  userId: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt: Timestamp | null;
  evidencePath: string | null;
  totalTax: Generated<string>;
  baseTotalPrice: string;
  totalAmountDue: string;
  note: string | null;
  userPhone: string | null;
  userAddress: string | null;
  updatedById: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type OrderItem = {
  orderItemId: string;
  orderId: string;
  orderItemName: string;
  referenceId: string;
  referenceType: ReferenceType;
  quantity: number;
  price: string;
  note: string | null;
};
export type Product = {
  productId: string;
  productName: string;
  productType: string;
  price: string;
  quantity: number;
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
  productCategoryId: string;
  productId: string;
  categoryId: string;
  createdAt: Generated<Timestamp>;
  createdById: string | null;
  updatedAt: Timestamp;
  updatedById: string | null;
  deletedAt: Timestamp | null;
};
export type ProductImage = {
  productImageId: string;
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
  permissionFeature: string;
  permissionAction: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};
export type UserLocation = {
  userLocationId: string;
  userId: string;
  phone: string;
  address: string;
};
export type DB = {
  Brand: Brand;
  CartItem: CartItem;
  CartSession: CartSession;
  category: Category;
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
