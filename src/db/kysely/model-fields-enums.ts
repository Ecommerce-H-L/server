export const Brand_FieldEnum = {
  id: 'id',
  brandName: 'brandName',
  description: 'description',
  createdAt: 'createdAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
} as const;
export type Brand_FieldEnum =
  (typeof Brand_FieldEnum)[keyof typeof Brand_FieldEnum];

export const Brand_FieldWithTableEnum = {
  id: 'null.id',
  brandName: 'null.brandName',
  description: 'null.description',
  createdAt: 'null.createdAt',
  createdById: 'null.createdById',
  updatedById: 'null.updatedById',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
} as const;
export type Brand_FieldWithTableEnum =
  (typeof Brand_FieldWithTableEnum)[keyof typeof Brand_FieldWithTableEnum];

export const CartItem_FieldEnum = {
  id: 'id',
  cartSessionId: 'cartSessionId',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  quantity: 'quantity',
  note: 'note',
} as const;
export type CartItem_FieldEnum =
  (typeof CartItem_FieldEnum)[keyof typeof CartItem_FieldEnum];

export const CartItem_FieldWithTableEnum = {
  id: 'null.id',
  cartSessionId: 'null.cartSessionId',
  referenceId: 'null.referenceId',
  referenceType: 'null.referenceType',
  quantity: 'null.quantity',
  note: 'null.note',
} as const;
export type CartItem_FieldWithTableEnum =
  (typeof CartItem_FieldWithTableEnum)[keyof typeof CartItem_FieldWithTableEnum];

export const CartSession_FieldEnum = {
  id: 'id',
  userId: 'userId',
  baseTotalPrice: 'baseTotalPrice',
  totalTax: 'totalTax',
} as const;
export type CartSession_FieldEnum =
  (typeof CartSession_FieldEnum)[keyof typeof CartSession_FieldEnum];

export const CartSession_FieldWithTableEnum = {
  id: 'null.id',
  userId: 'null.userId',
  baseTotalPrice: 'null.baseTotalPrice',
  totalTax: 'null.totalTax',
} as const;
export type CartSession_FieldWithTableEnum =
  (typeof CartSession_FieldWithTableEnum)[keyof typeof CartSession_FieldWithTableEnum];

export const Category_FieldEnum = {
  id: 'id',
  categoryName: 'categoryName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
} as const;
export type Category_FieldEnum =
  (typeof Category_FieldEnum)[keyof typeof Category_FieldEnum];

export const Category_FieldWithTableEnum = {
  id: 'null.id',
  categoryName: 'null.categoryName',
  createdAt: 'null.createdAt',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
  createdById: 'null.createdById',
  updatedById: 'null.updatedById',
} as const;
export type Category_FieldWithTableEnum =
  (typeof Category_FieldWithTableEnum)[keyof typeof Category_FieldWithTableEnum];

export const Order_FieldEnum = {
  id: 'id',
  userId: 'userId',
  orderStatus: 'orderStatus',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  paidAt: 'paidAt',
  evidencePath: 'evidencePath',
  totalTax: 'totalTax',
  baseTotalPrice: 'baseTotalPrice',
  totalAmountDue: 'totalAmountDue',
  note: 'note',
  userPhone: 'userPhone',
  userAddress: 'userAddress',
  updatedById: 'updatedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
} as const;
export type Order_FieldEnum =
  (typeof Order_FieldEnum)[keyof typeof Order_FieldEnum];

export const Order_FieldWithTableEnum = {
  id: 'null.id',
  userId: 'null.userId',
  orderStatus: 'null.orderStatus',
  paymentMethod: 'null.paymentMethod',
  paymentStatus: 'null.paymentStatus',
  paidAt: 'null.paidAt',
  evidencePath: 'null.evidencePath',
  totalTax: 'null.totalTax',
  baseTotalPrice: 'null.baseTotalPrice',
  totalAmountDue: 'null.totalAmountDue',
  note: 'null.note',
  userPhone: 'null.userPhone',
  userAddress: 'null.userAddress',
  updatedById: 'null.updatedById',
  createdAt: 'null.createdAt',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
} as const;
export type Order_FieldWithTableEnum =
  (typeof Order_FieldWithTableEnum)[keyof typeof Order_FieldWithTableEnum];

export const OrderItem_FieldEnum = {
  id: 'id',
  orderId: 'orderId',
  orderItemName: 'orderItemName',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  quantity: 'quantity',
  price: 'price',
  note: 'note',
} as const;
export type OrderItem_FieldEnum =
  (typeof OrderItem_FieldEnum)[keyof typeof OrderItem_FieldEnum];

export const OrderItem_FieldWithTableEnum = {
  id: 'null.id',
  orderId: 'null.orderId',
  orderItemName: 'null.orderItemName',
  referenceId: 'null.referenceId',
  referenceType: 'null.referenceType',
  quantity: 'null.quantity',
  price: 'null.price',
  note: 'null.note',
} as const;
export type OrderItem_FieldWithTableEnum =
  (typeof OrderItem_FieldWithTableEnum)[keyof typeof OrderItem_FieldWithTableEnum];

export const Product_FieldEnum = {
  id: 'id',
  productName: 'productName',
  productType: 'productType',
  price: 'price',
  quantity: 'quantity',
  usageInstructions: 'usageInstructions',
  description: 'description',
  ingredients: 'ingredients',
  brandId: 'brandId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
} as const;
export type Product_FieldEnum =
  (typeof Product_FieldEnum)[keyof typeof Product_FieldEnum];

export const Product_FieldWithTableEnum = {
  id: 'null.id',
  productName: 'null.productName',
  productType: 'null.productType',
  price: 'null.price',
  quantity: 'null.quantity',
  usageInstructions: 'null.usageInstructions',
  description: 'null.description',
  ingredients: 'null.ingredients',
  brandId: 'null.brandId',
  createdAt: 'null.createdAt',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
  createdById: 'null.createdById',
  updatedById: 'null.updatedById',
} as const;
export type Product_FieldWithTableEnum =
  (typeof Product_FieldWithTableEnum)[keyof typeof Product_FieldWithTableEnum];

export const ProductCategory_FieldEnum = {
  id: 'id',
  productId: 'productId',
  categoryId: 'categoryId',
  createdAt: 'createdAt',
  createdById: 'createdById',
  updatedAt: 'updatedAt',
  updatedById: 'updatedById',
  deletedAt: 'deletedAt',
} as const;
export type ProductCategory_FieldEnum =
  (typeof ProductCategory_FieldEnum)[keyof typeof ProductCategory_FieldEnum];

export const ProductCategory_FieldWithTableEnum = {
  id: 'null.id',
  productId: 'null.productId',
  categoryId: 'null.categoryId',
  createdAt: 'null.createdAt',
  createdById: 'null.createdById',
  updatedAt: 'null.updatedAt',
  updatedById: 'null.updatedById',
  deletedAt: 'null.deletedAt',
} as const;
export type ProductCategory_FieldWithTableEnum =
  (typeof ProductCategory_FieldWithTableEnum)[keyof typeof ProductCategory_FieldWithTableEnum];

export const ProductImage_FieldEnum = {
  id: 'id',
  productId: 'productId',
  imagePath: 'imagePath',
  createdAt: 'createdAt',
  createdById: 'createdById',
  updatedAt: 'updatedAt',
  updatedById: 'updatedById',
  deletedAt: 'deletedAt',
} as const;
export type ProductImage_FieldEnum =
  (typeof ProductImage_FieldEnum)[keyof typeof ProductImage_FieldEnum];

export const ProductImage_FieldWithTableEnum = {
  id: 'null.id',
  productId: 'null.productId',
  imagePath: 'null.imagePath',
  createdAt: 'null.createdAt',
  createdById: 'null.createdById',
  updatedAt: 'null.updatedAt',
  updatedById: 'null.updatedById',
  deletedAt: 'null.deletedAt',
} as const;
export type ProductImage_FieldWithTableEnum =
  (typeof ProductImage_FieldWithTableEnum)[keyof typeof ProductImage_FieldWithTableEnum];

export const RefreshToken_FieldEnum = {
  token: 'token',
  userId: 'userId',
  expiredAt: 'expiredAt',
  createdAt: 'createdAt',
} as const;
export type RefreshToken_FieldEnum =
  (typeof RefreshToken_FieldEnum)[keyof typeof RefreshToken_FieldEnum];

export const RefreshToken_FieldWithTableEnum = {
  token: 'null.token',
  userId: 'null.userId',
  expiredAt: 'null.expiredAt',
  createdAt: 'null.createdAt',
} as const;
export type RefreshToken_FieldWithTableEnum =
  (typeof RefreshToken_FieldWithTableEnum)[keyof typeof RefreshToken_FieldWithTableEnum];

export const RolePermission_FieldEnum = {
  rolePermissionId: 'rolePermissionId',
  role: 'role',
  permissionFeature: 'permissionFeature',
  permissionAction: 'permissionAction',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
} as const;
export type RolePermission_FieldEnum =
  (typeof RolePermission_FieldEnum)[keyof typeof RolePermission_FieldEnum];

export const RolePermission_FieldWithTableEnum = {
  rolePermissionId: 'null.rolePermissionId',
  role: 'null.role',
  permissionFeature: 'null.permissionFeature',
  permissionAction: 'null.permissionAction',
  createdAt: 'null.createdAt',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
} as const;
export type RolePermission_FieldWithTableEnum =
  (typeof RolePermission_FieldWithTableEnum)[keyof typeof RolePermission_FieldWithTableEnum];

export const User_FieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
} as const;
export type User_FieldEnum =
  (typeof User_FieldEnum)[keyof typeof User_FieldEnum];

export const User_FieldWithTableEnum = {
  id: 'null.id',
  firstName: 'null.firstName',
  lastName: 'null.lastName',
  email: 'null.email',
  passwordHash: 'null.passwordHash',
  role: 'null.role',
  createdAt: 'null.createdAt',
  updatedAt: 'null.updatedAt',
  deletedAt: 'null.deletedAt',
} as const;
export type User_FieldWithTableEnum =
  (typeof User_FieldWithTableEnum)[keyof typeof User_FieldWithTableEnum];

export const UserLocation_FieldEnum = {
  id: 'id',
  userId: 'userId',
  phone: 'phone',
  address: 'address',
} as const;
export type UserLocation_FieldEnum =
  (typeof UserLocation_FieldEnum)[keyof typeof UserLocation_FieldEnum];

export const UserLocation_FieldWithTableEnum = {
  id: 'null.id',
  userId: 'null.userId',
  phone: 'null.phone',
  address: 'null.address',
} as const;
export type UserLocation_FieldWithTableEnum =
  (typeof UserLocation_FieldWithTableEnum)[keyof typeof UserLocation_FieldWithTableEnum];

export const VerificationCode_FieldEnum = {
  id: 'id',
  email: 'email',
  code: 'code',
  type: 'type',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
} as const;
export type VerificationCode_FieldEnum =
  (typeof VerificationCode_FieldEnum)[keyof typeof VerificationCode_FieldEnum];

export const VerificationCode_FieldWithTableEnum = {
  id: 'null.id',
  email: 'null.email',
  code: 'null.code',
  type: 'null.type',
  expiresAt: 'null.expiresAt',
  createdAt: 'null.createdAt',
} as const;
export type VerificationCode_FieldWithTableEnum =
  (typeof VerificationCode_FieldWithTableEnum)[keyof typeof VerificationCode_FieldWithTableEnum];

export const DB_TableEnum = {
  Brand: 'Brand',
  CartItem: 'CartItem',
  CartSession: 'CartSession',
  Category: 'Category',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Product: 'Product',
  ProductCategory: 'ProductCategory',
  ProductImage: 'ProductImage',
  RefreshToken: 'RefreshToken',
  RolePermission: 'RolePermission',
  User: 'User',
  UserLocation: 'UserLocation',
  VerificationCode: 'VerificationCode',
} as const;
export type DB_TableEnum = (typeof DB_TableEnum)[keyof typeof DB_TableEnum];
