// ============================================================
// Style Secrets — Complete Database & Application Types
// ============================================================

// ---------- Enums ----------
export type ProductStatus = 'published' | 'draft' | 'archived';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';
export type UserRole = 'customer' | 'admin';

// ---------- Core Models ----------
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_bn: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  sku: string;
  regular_price: number;
  sale_price: number | null;
  is_variable: boolean;
  is_featured: boolean;
  is_new: boolean;
  status: ProductStatus;
  category_id: string | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  avg_rating: number;
  review_count: number;
  total_stock: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  images?: ProductImage[];
  variations?: ProductVariation[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  values?: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  color_hex: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attributes?: VariationAttribute[];
}

export interface VariationAttribute {
  id: string;
  variation_id: string;
  attribute_id: string;
  attribute_value_id: string;
  attribute_name?: string;
  attribute_value?: string;
  color_hex?: string | null;
}

// ---------- Inventory ----------
export interface InventoryMovement {
  id: string;
  product_id: string;
  variation_id: string | null;
  quantity_change: number;
  reason: string;
  reference_type: 'order' | 'adjustment' | 'return' | 'restock';
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
}

// ---------- Cart ----------
export interface CartItem {
  id: string;
  product_id: string;
  variation_id: string | null;
  quantity: number;
  product?: Product;
  variation?: ProductVariation;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// ---------- Orders ----------
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  division: string;
  district: string;
  address: string;
  order_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  coupon_code: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  sender_phone: string | null;
  transaction_id: string | null;
  is_suspicious: boolean;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id: string | null;
  product_name: string;
  product_sku: string;
  variation_attributes: Record<string, string> | null;
  image_url: string | null;
  regular_price: number;
  sale_price: number | null;
  unit_price: number;
  quantity: number;
  total: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

// ---------- Payment ----------
export interface PaymentSetting {
  id: string;
  method: PaymentMethod;
  is_enabled: boolean;
  account_number: string | null;
  account_type: string | null;
  instructions: string | null;
  logo_url: string | null;
  sort_order: number;
  updated_at: string;
}

// ---------- Store Settings ----------
export interface StoreSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'json' | 'number' | 'boolean';
  group: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

// ---------- Homepage ----------
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string;
  button_link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  discount_text: string | null;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

// ---------- Coupons ----------
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Wishlist ----------
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// ---------- Newsletter ----------
export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

// ---------- Activity Log ----------
export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// ---------- Dashboard Stats ----------
export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  registered_customers: number;
  total_sales: number;
}

// ---------- Delivery ----------
export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  is_active: boolean;
}

// Bangladesh divisions and districts
export const DIVISIONS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
  'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
] as const;

export const DISTRICTS: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Kishoreganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'],
  Chittagong: ['Chittagong', "Cox's Bazar", 'Comilla', 'Feni', 'Lakshmipur', 'Noakhali', 'Rangamati', 'Khagrachhari', 'Bandarban', 'Brahmanbaria', 'Chandpur'],
  Rajshahi: ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon', 'Nawabganj', 'Joypurhat'],
  Khulna: ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur', 'Jhenaidah', 'Magura'],
  Barisal: ['Barisal', 'Bhola', 'Jhalokathi', 'Patuakhali', 'Pirojpur', 'Barguna'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

// ---------- API Response ----------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ---------- Pagination ----------
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ---------- Welcome Popup ----------
export type PopupFrequency = 'every_visit' | 'once_per_session' | 'every_n_days' | 'every_page_load' | 'disabled';
export type PopupTargetPages = 'homepage_only' | 'all_public';

export interface WelcomePopupSettings {
  is_enabled: boolean;
  welcome_text: string;
  brand_title: string;
  brand_subtitle: string;
  special_offer_heading: string;
  discount_badge_text: string;
  discount_title: string;
  discount_subtitle: string;
  badge_text: string;
  email_placeholder: string;
  button_text: string;
  supporting_text: string;
  coupon_code: string;
  success_heading: string;
  success_message: string;
  image_url: string;
  frequency: PopupFrequency;
  frequency_days: number;
  delay_seconds: number;
  close_on_overlay_click: boolean;
  target_pages: PopupTargetPages;
  desktop_enabled: boolean;
  mobile_enabled: boolean;
  // Service strip
  service_delivery_title: string;
  service_delivery_sub: string;
  service_payment_title: string;
  service_payment_sub: string;
  service_return_title: string;
  service_return_sub: string;
  service_support_title: string;
  service_support_sub: string;
}

