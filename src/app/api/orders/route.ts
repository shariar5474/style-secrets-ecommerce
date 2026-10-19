import { NextResponse } from 'next/server';
import { DEMO_PRODUCTS } from '@/lib/data/sampleData';
import { generateOrderNumber, validateBDPhone } from '@/lib/utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Order, OrderItem } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      division,
      district,
      address,
      order_notes,
      payment_method,
      sender_phone,
      transaction_id,
      coupon_code,
      items,
    } = body;

    // 1. Server-side Input Validation
    if (!customer_name || customer_name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Valid customer name is required' }, { status: 400 });
    }
    if (!customer_phone || !validateBDPhone(customer_phone)) {
      return NextResponse.json({ success: false, error: 'A valid 11-digit Bangladesh phone number is required' }, { status: 400 });
    }
    if (!address || address.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Full street address is required' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Order must contain at least one item' }, { status: 400 });
    }

    // 2. Server-side Price & Stock Calculation (Never trust client prices!)
    let calculatedSubtotal = 0;
    const validatedOrderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = DEMO_PRODUCTS.find((p) => p.id === item.product_id);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.product_id}` }, { status: 400 });
      }

      let unitPrice = product.sale_price ?? product.regular_price;
      let sku = product.sku;
      let variationAttributes: Record<string, string> | null = null;
      let itemImage = product.featured_image_url;

      if (item.variation_id && product.variations) {
        const variation = product.variations.find((v) => v.id === item.variation_id);
        if (variation) {
          unitPrice = variation.sale_price ?? variation.regular_price;
          sku = variation.sku;
          if (variation.image_url) itemImage = variation.image_url;
          if (variation.attributes) {
            variationAttributes = {};
            variation.attributes.forEach((a) => {
              variationAttributes![a.attribute_name || 'Option'] = a.attribute_value || '';
            });
          }
        }
      }

      const qty = Math.max(1, parseInt(item.quantity || 1, 10));
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product_id: product.id,
        variation_id: item.variation_id || null,
        product_name: product.name,
        product_sku: sku,
        variation_attributes: variationAttributes,
        image_url: itemImage,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        unit_price: unitPrice,
        quantity: qty,
        total: lineTotal,
      });
    }

    // Calculate delivery charge
    const deliveryFee = calculatedSubtotal >= 1500 ? 0 : (district?.toLowerCase() === 'dhaka' ? 60 : 120);

    // Calculate coupon discount
    let discountAmount = 0;
    if (coupon_code) {
      const codeUpper = coupon_code.toUpperCase().trim();
      if (codeUpper === 'STYLE10') {
        discountAmount = Math.round(calculatedSubtotal * 0.1);
      } else if (codeUpper === 'FLAT200') {
        discountAmount = 200;
      }
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal + deliveryFee - discountAmount);
    const orderNumber = generateOrderNumber();

    const orderData: Partial<Order> = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: null,
      customer_name,
      customer_phone,
      customer_email: customer_email || null,
      division: division || 'Dhaka',
      district: district || 'Dhaka',
      address,
      order_notes: order_notes || null,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      total: calculatedTotal,
      coupon_code: coupon_code || null,
      payment_method,
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
      order_status: 'pending',
      sender_phone: sender_phone || null,
      transaction_id: transaction_id || null,
      is_suspicious: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: validatedOrderItems as OrderItem[],
    };

    // Attempt to persist to Supabase if configured
    try {
      const supabase = createServerSupabaseClient();
      const { data: insertedOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name,
          customer_phone,
          customer_email: customer_email || null,
          division,
          district,
          address,
          order_notes,
          subtotal: calculatedSubtotal,
          delivery_fee: deliveryFee,
          discount_amount: discountAmount,
          total: calculatedTotal,
          coupon_code,
          payment_method,
          payment_status: 'pending',
          order_status: 'pending',
          sender_phone,
          transaction_id,
        })
        .select()
        .single();

      if (!orderErr && insertedOrder) {
        orderData.id = insertedOrder.id;
      }
    } catch {
      // Supabase not yet connected or configured; proceed gracefully in demo mode
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: orderData,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while creating order' },
      { status: 500 }
    );
  }
}
