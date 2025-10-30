import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  order_status,
  payment_method,
  payment_status,
  reference_type,
  user_role,
} from './enums';

export type brand = {
  brand_id: string;
  brand_name: string;
  description: string | null;
  created_at: Generated<Timestamp>;
  created_by: string | null;
  updated_at: Timestamp;
  updated_by: string | null;
  deleted_at: Timestamp | null;
};
export type cart_item = {
  cart_item_id: string;
  cart_session_id: string;
  reference_id: string;
  reference_type: reference_type;
  quantity: number;
  note: string | null;
};
export type cart_session = {
  cart_session_id: string;
  user_id: string;
  base_total_price: string;
  total_tax: string;
};
export type category = {
  category_id: string;
  category_name: string;
  created_at: Generated<Timestamp>;
  created_by: string | null;
  updated_at: Timestamp;
  updated_by: string | null;
  deleted_at: Timestamp | null;
};
export type order = {
  order_id: string;
  user_id: string;
  order_status: order_status;
  payment_method: payment_method;
  payment_status: payment_status;
  paid_at: Timestamp | null;
  evidence_path: string | null;
  total_tax: Generated<string>;
  base_total_price: string;
  total_amount_due: string;
  note: string | null;
  user_phone: string | null;
  user_address: string | null;
  updated_by: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
};
export type order_item = {
  order_item_id: string;
  order_id: string;
  order_item_name: string;
  reference_id: string;
  reference_type: reference_type;
  quantity: number;
  price: string;
  note: string | null;
};
export type product = {
  product_id: string;
  product_name: string;
  product_type: string;
  price: string;
  quantity: number;
  usage_instructions: string | null;
  description: string | null;
  ingredients: string | null;
  brand_id: string | null;
  created_at: Generated<Timestamp>;
  created_by: string | null;
  updated_at: Timestamp;
  updated_by: string | null;
  deleted_at: Timestamp | null;
};
export type product_category = {
  product_category_id: string;
  product_id: string;
  category_id: string;
  created_at: Generated<Timestamp>;
  created_by: string | null;
  updated_at: Timestamp;
  updated_by: string | null;
  deleted_at: Timestamp | null;
};
export type product_images = {
  product_image_id: string;
  product_id: string;
  image_path: string;
  created_at: Generated<Timestamp>;
  created_by: string | null;
  updated_at: Timestamp;
  updated_by: string | null;
  deleted_at: Timestamp | null;
};
export type refresh_token = {
  token: string;
  user_id: string;
  expired_at: Timestamp;
  created_at: Generated<Timestamp>;
};
export type role_permission = {
  role_permission_id: string;
  permission_feature: string;
  permission_action: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
};
export type user = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: user_role;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
};
export type user_location = {
  user_location_id: string;
  user_id: string;
  phone: string;
  address: string;
};
export type DB = {
  brand: brand;
  cart_item: cart_item;
  cart_session: cart_session;
  category: category;
  order: order;
  order_item: order_item;
  product: product;
  product_category: product_category;
  product_images: product_images;
  refresh_token: refresh_token;
  role_permission: role_permission;
  user: user;
  user_location: user_location;
};
