import { z } from 'zod';

// Bangladesh phone validation
const bdPhoneRegex = /^(\+?880|0)?(1[3-9]\d{8})$/;

export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(bdPhoneRegex, 'Please enter a valid Bangladesh phone number');

export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .optional()
  .or(z.literal(''));

// Checkout form validation
export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required').max(100),
  customer_phone: phoneSchema,
  customer_email: emailSchema,
  division: z.string().min(1, 'Please select a division'),
  district: z.string().min(1, 'Please select a district'),
  address: z.string().min(5, 'Please enter your full delivery address').max(500),
  order_notes: z.string().max(500).optional(),
  payment_method: z.enum(['cod', 'bkash', 'nagad', 'rocket']),
  sender_phone: z.string().optional(),
  transaction_id: z.string().optional(),
}).refine((data) => {
  // If payment method is mobile financial, sender_phone should be provided
  if (['bkash', 'nagad', 'rocket'].includes(data.payment_method)) {
    return data.sender_phone && data.sender_phone.length > 0;
  }
  return true;
}, {
  message: 'Sender phone number is required for mobile payment',
  path: ['sender_phone'],
});

// Product validation
export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  slug: z.string().min(2).max(200),
  description: z.string().optional(),
  short_description: z.string().max(300).optional(),
  sku: z.string().min(1, 'SKU is required').max(50),
  regular_price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive().optional().nullable(),
  is_variable: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
  category_id: z.string().uuid().optional().nullable(),
  meta_title: z.string().max(100).optional(),
  meta_description: z.string().max(300).optional(),
}).refine((data) => {
  if (data.sale_price && data.sale_price >= data.regular_price) {
    return false;
  }
  return true;
}, {
  message: 'Sale price must be less than regular price',
  path: ['sale_price'],
});

// Variation validation
export const variationSchema = z.object({
  sku: z.string().min(1, 'Variation SKU is required'),
  regular_price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive().optional().nullable(),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
  is_active: z.boolean().default(true),
  attributes: z.array(z.object({
    attribute_id: z.string().uuid(),
    attribute_value_id: z.string().uuid(),
  })).min(1, 'At least one attribute is required'),
});

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  name_bn: z.string().max(100).optional().nullable(),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// Coupon validation
export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code is required').max(30),
  description: z.string().max(200).optional(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive('Discount value must be positive'),
  min_order_amount: z.number().positive().optional().nullable(),
  max_discount_amount: z.number().positive().optional().nullable(),
  usage_limit: z.number().int().positive().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

// Newsletter subscription
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Login
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration
export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// Store settings
export const storeSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(['text', 'image', 'json', 'number', 'boolean']),
  group: z.string(),
});

// Hero slide
export const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  button_text: z.string().max(50).default('Shop Now'),
  button_link: z.string().max(200).default('/products'),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// Payment setting
export const paymentSettingSchema = z.object({
  method: z.enum(['cod', 'bkash', 'nagad', 'rocket']),
  is_enabled: z.boolean(),
  account_number: z.string().max(20).optional().nullable(),
  account_type: z.string().max(50).optional().nullable(),
  instructions: z.string().max(500).optional().nullable(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type VariationFormData = z.infer<typeof variationSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
