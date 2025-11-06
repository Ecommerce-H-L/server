export const brand_FieldEnum = {
  brand_id: 'brand_id',
  brand_name: 'brand_name',
  description: 'description',
  created_at: 'created_at',
  created_by: 'created_by',
  updated_at: 'updated_at',
  updated_by: 'updated_by',
  deleted_at: 'deleted_at',
} as const;
export type brand_FieldEnum =
  (typeof brand_FieldEnum)[keyof typeof brand_FieldEnum];

export const brand_FieldWithTableEnum = {
  brand_id: 'brand.brand_id',
  brand_name: 'brand.brand_name',
  description: 'brand.description',
  created_at: 'brand.created_at',
  created_by: 'brand.created_by',
  updated_at: 'brand.updated_at',
  updated_by: 'brand.updated_by',
  deleted_at: 'brand.deleted_at',
} as const;
export type brand_FieldWithTableEnum =
  (typeof brand_FieldWithTableEnum)[keyof typeof brand_FieldWithTableEnum];

export const cart_item_FieldEnum = {
  cart_item_id: 'cart_item_id',
  cart_session_id: 'cart_session_id',
  reference_id: 'reference_id',
  reference_type: 'reference_type',
  quantity: 'quantity',
  note: 'note',
} as const;
export type cart_item_FieldEnum =
  (typeof cart_item_FieldEnum)[keyof typeof cart_item_FieldEnum];

export const cart_item_FieldWithTableEnum = {
  cart_item_id: 'cart_item.cart_item_id',
  cart_session_id: 'cart_item.cart_session_id',
  reference_id: 'cart_item.reference_id',
  reference_type: 'cart_item.reference_type',
  quantity: 'cart_item.quantity',
  note: 'cart_item.note',
} as const;
export type cart_item_FieldWithTableEnum =
  (typeof cart_item_FieldWithTableEnum)[keyof typeof cart_item_FieldWithTableEnum];

export const cart_session_FieldEnum = {
  cart_session_id: 'cart_session_id',
  user_id: 'user_id',
  base_total_price: 'base_total_price',
  total_tax: 'total_tax',
} as const;
export type cart_session_FieldEnum =
  (typeof cart_session_FieldEnum)[keyof typeof cart_session_FieldEnum];

export const cart_session_FieldWithTableEnum = {
  cart_session_id: 'cart_session.cart_session_id',
  user_id: 'cart_session.user_id',
  base_total_price: 'cart_session.base_total_price',
  total_tax: 'cart_session.total_tax',
} as const;
export type cart_session_FieldWithTableEnum =
  (typeof cart_session_FieldWithTableEnum)[keyof typeof cart_session_FieldWithTableEnum];

export const category_FieldEnum = {
  category_id: 'category_id',
  category_name: 'category_name',
  created_at: 'created_at',
  created_by: 'created_by',
  updated_at: 'updated_at',
  updated_by: 'updated_by',
  deleted_at: 'deleted_at',
} as const;
export type category_FieldEnum =
  (typeof category_FieldEnum)[keyof typeof category_FieldEnum];

export const category_FieldWithTableEnum = {
  category_id: 'category.category_id',
  category_name: 'category.category_name',
  created_at: 'category.created_at',
  created_by: 'category.created_by',
  updated_at: 'category.updated_at',
  updated_by: 'category.updated_by',
  deleted_at: 'category.deleted_at',
} as const;
export type category_FieldWithTableEnum =
  (typeof category_FieldWithTableEnum)[keyof typeof category_FieldWithTableEnum];

export const order_FieldEnum = {
  order_id: 'order_id',
  user_id: 'user_id',
  order_status: 'order_status',
  payment_method: 'payment_method',
  payment_status: 'payment_status',
  paid_at: 'paid_at',
  evidence_path: 'evidence_path',
  total_tax: 'total_tax',
  base_total_price: 'base_total_price',
  total_amount_due: 'total_amount_due',
  note: 'note',
  user_phone: 'user_phone',
  user_address: 'user_address',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
} as const;
export type order_FieldEnum =
  (typeof order_FieldEnum)[keyof typeof order_FieldEnum];

export const order_FieldWithTableEnum = {
  order_id: 'order.order_id',
  user_id: 'order.user_id',
  order_status: 'order.order_status',
  payment_method: 'order.payment_method',
  payment_status: 'order.payment_status',
  paid_at: 'order.paid_at',
  evidence_path: 'order.evidence_path',
  total_tax: 'order.total_tax',
  base_total_price: 'order.base_total_price',
  total_amount_due: 'order.total_amount_due',
  note: 'order.note',
  user_phone: 'order.user_phone',
  user_address: 'order.user_address',
  updated_by: 'order.updated_by',
  created_at: 'order.created_at',
  updated_at: 'order.updated_at',
  deleted_at: 'order.deleted_at',
} as const;
export type order_FieldWithTableEnum =
  (typeof order_FieldWithTableEnum)[keyof typeof order_FieldWithTableEnum];

export const order_item_FieldEnum = {
  order_item_id: 'order_item_id',
  order_id: 'order_id',
  order_item_name: 'order_item_name',
  reference_id: 'reference_id',
  reference_type: 'reference_type',
  quantity: 'quantity',
  price: 'price',
  note: 'note',
} as const;
export type order_item_FieldEnum =
  (typeof order_item_FieldEnum)[keyof typeof order_item_FieldEnum];

export const order_item_FieldWithTableEnum = {
  order_item_id: 'order_item.order_item_id',
  order_id: 'order_item.order_id',
  order_item_name: 'order_item.order_item_name',
  reference_id: 'order_item.reference_id',
  reference_type: 'order_item.reference_type',
  quantity: 'order_item.quantity',
  price: 'order_item.price',
  note: 'order_item.note',
} as const;
export type order_item_FieldWithTableEnum =
  (typeof order_item_FieldWithTableEnum)[keyof typeof order_item_FieldWithTableEnum];

export const product_FieldEnum = {
  product_id: 'product_id',
  product_name: 'product_name',
  product_type: 'product_type',
  price: 'price',
  quantity: 'quantity',
  usage_instructions: 'usage_instructions',
  description: 'description',
  ingredients: 'ingredients',
  brand_id: 'brand_id',
  created_at: 'created_at',
  created_by: 'created_by',
  updated_at: 'updated_at',
  updated_by: 'updated_by',
  deleted_at: 'deleted_at',
} as const;
export type product_FieldEnum =
  (typeof product_FieldEnum)[keyof typeof product_FieldEnum];

export const product_FieldWithTableEnum = {
  product_id: 'product.product_id',
  product_name: 'product.product_name',
  product_type: 'product.product_type',
  price: 'product.price',
  quantity: 'product.quantity',
  usage_instructions: 'product.usage_instructions',
  description: 'product.description',
  ingredients: 'product.ingredients',
  brand_id: 'product.brand_id',
  created_at: 'product.created_at',
  created_by: 'product.created_by',
  updated_at: 'product.updated_at',
  updated_by: 'product.updated_by',
  deleted_at: 'product.deleted_at',
} as const;
export type product_FieldWithTableEnum =
  (typeof product_FieldWithTableEnum)[keyof typeof product_FieldWithTableEnum];

export const product_category_FieldEnum = {
  product_category_id: 'product_category_id',
  product_id: 'product_id',
  category_id: 'category_id',
  created_at: 'created_at',
  created_by: 'created_by',
  updated_at: 'updated_at',
  updated_by: 'updated_by',
  deleted_at: 'deleted_at',
} as const;
export type product_category_FieldEnum =
  (typeof product_category_FieldEnum)[keyof typeof product_category_FieldEnum];

export const product_category_FieldWithTableEnum = {
  product_category_id: 'product_category.product_category_id',
  product_id: 'product_category.product_id',
  category_id: 'product_category.category_id',
  created_at: 'product_category.created_at',
  created_by: 'product_category.created_by',
  updated_at: 'product_category.updated_at',
  updated_by: 'product_category.updated_by',
  deleted_at: 'product_category.deleted_at',
} as const;
export type product_category_FieldWithTableEnum =
  (typeof product_category_FieldWithTableEnum)[keyof typeof product_category_FieldWithTableEnum];

export const product_images_FieldEnum = {
  product_image_id: 'product_image_id',
  product_id: 'product_id',
  image_path: 'image_path',
  created_at: 'created_at',
  created_by: 'created_by',
  updated_at: 'updated_at',
  updated_by: 'updated_by',
  deleted_at: 'deleted_at',
} as const;
export type product_images_FieldEnum =
  (typeof product_images_FieldEnum)[keyof typeof product_images_FieldEnum];

export const product_images_FieldWithTableEnum = {
  product_image_id: 'product_images.product_image_id',
  product_id: 'product_images.product_id',
  image_path: 'product_images.image_path',
  created_at: 'product_images.created_at',
  created_by: 'product_images.created_by',
  updated_at: 'product_images.updated_at',
  updated_by: 'product_images.updated_by',
  deleted_at: 'product_images.deleted_at',
} as const;
export type product_images_FieldWithTableEnum =
  (typeof product_images_FieldWithTableEnum)[keyof typeof product_images_FieldWithTableEnum];

export const refresh_token_FieldEnum = {
  token: 'token',
  user_id: 'user_id',
  expired_at: 'expired_at',
  created_at: 'created_at',
} as const;
export type refresh_token_FieldEnum =
  (typeof refresh_token_FieldEnum)[keyof typeof refresh_token_FieldEnum];

export const refresh_token_FieldWithTableEnum = {
  token: 'refresh_token.token',
  user_id: 'refresh_token.user_id',
  expired_at: 'refresh_token.expired_at',
  created_at: 'refresh_token.created_at',
} as const;
export type refresh_token_FieldWithTableEnum =
  (typeof refresh_token_FieldWithTableEnum)[keyof typeof refresh_token_FieldWithTableEnum];

export const role_permission_FieldEnum = {
  role_permission_id: 'role_permission_id',
  permission_feature: 'permission_feature',
  permission_action: 'permission_action',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
} as const;
export type role_permission_FieldEnum =
  (typeof role_permission_FieldEnum)[keyof typeof role_permission_FieldEnum];

export const role_permission_FieldWithTableEnum = {
  role_permission_id: 'role_permission.role_permission_id',
  permission_feature: 'role_permission.permission_feature',
  permission_action: 'role_permission.permission_action',
  created_at: 'role_permission.created_at',
  updated_at: 'role_permission.updated_at',
  deleted_at: 'role_permission.deleted_at',
} as const;
export type role_permission_FieldWithTableEnum =
  (typeof role_permission_FieldWithTableEnum)[keyof typeof role_permission_FieldWithTableEnum];

export const user_FieldEnum = {
  user_id: 'user_id',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  password_hash: 'password_hash',
  role: 'role',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
} as const;
export type user_FieldEnum =
  (typeof user_FieldEnum)[keyof typeof user_FieldEnum];

export const user_FieldWithTableEnum = {
  user_id: 'user.user_id',
  first_name: 'user.first_name',
  last_name: 'user.last_name',
  email: 'user.email',
  password_hash: 'user.password_hash',
  role: 'user.role',
  created_at: 'user.created_at',
  updated_at: 'user.updated_at',
  deleted_at: 'user.deleted_at',
} as const;
export type user_FieldWithTableEnum =
  (typeof user_FieldWithTableEnum)[keyof typeof user_FieldWithTableEnum];

export const user_location_FieldEnum = {
  user_location_id: 'user_location_id',
  user_id: 'user_id',
  phone: 'phone',
  address: 'address',
} as const;
export type user_location_FieldEnum =
  (typeof user_location_FieldEnum)[keyof typeof user_location_FieldEnum];

export const user_location_FieldWithTableEnum = {
  user_location_id: 'user_location.user_location_id',
  user_id: 'user_location.user_id',
  phone: 'user_location.phone',
  address: 'user_location.address',
} as const;
export type user_location_FieldWithTableEnum =
  (typeof user_location_FieldWithTableEnum)[keyof typeof user_location_FieldWithTableEnum];

export const DB_TableEnum = {
  brand: 'brand',
  cart_item: 'cart_item',
  cart_session: 'cart_session',
  category: 'category',
  order: 'order',
  order_item: 'order_item',
  product: 'product',
  product_category: 'product_category',
  product_images: 'product_images',
  refresh_token: 'refresh_token',
  role_permission: 'role_permission',
  user: 'user',
  user_location: 'user_location',
} as const;
export type DB_TableEnum = (typeof DB_TableEnum)[keyof typeof DB_TableEnum];
