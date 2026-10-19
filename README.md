# Style Secrets — Ladies Clothing E-Commerce

A premium, production-oriented ladies' clothing e-commerce website built with Next.js, TypeScript, Tailwind CSS, and Supabase. Designed for the Bangladesh market with support for local payment methods (bKash, Nagad, Rocket, Cash on Delivery).

## 🌟 Features

### Customer Storefront
- **Premium feminine design** — Pink, ivory, and gold color scheme with elegant typography
- **Hero carousel** — Admin-configurable promotional slides
- **Product catalog** — Category browsing, search, filtering, and sorting
- **Product variations** — Size, color, and custom attributes with per-variation pricing, stock, and images
- **Shopping cart** — Slide-out drawer with quantity controls and variation display
- **Checkout** — Bangladesh divisions/districts, multiple payment methods
- **Customer accounts** — Registration, login, order history, wishlist, saved addresses
- **Responsive design** — Desktop, tablet, and mobile optimized

### Admin Dashboard
- **Dashboard** — Order stats, sales overview, recent activity
- **Product management** — Full CRUD with variation support, images, categories
- **Category management** — Nested categories with Bengali labels
- **Order management** — Status tracking, payment verification, order history
- **Inventory management** — Stock tracking, low-stock alerts, movement history
- **Customer management** — User accounts, activity monitoring
- **Store settings** — Logo, contact info, social links, delivery fees
- **Payment settings** — Configure bKash, Nagad, Rocket numbers and instructions
- **Banner management** — Hero slides and promotional banners
- **Coupon system** — Percentage and fixed-amount discounts
- **Reports** — Sales, orders, and product analytics

### Security
- Server-side price validation
- Role-based access control (customer/admin)
- Supabase Row Level Security
- Bangladesh phone number validation
- Rate limiting and bot detection hooks
- Secure session management
- Order snapshot preservation

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| State | Zustand (cart) |
| Validation | Zod |
| Carousel | Embla Carousel |
| Icons | Lucide React |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (free tier works)

### Steps

1. **Clone or extract the project:**
   ```bash
   cd style-secrets-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Set up the database:**
   - Go to your Supabase dashboard → SQL Editor
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - This creates all tables, indexes, RLS policies, and triggers

5. **Create initial admin account:**
   - Register a new user through the app or Supabase dashboard
   - In Supabase SQL Editor, run:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
     ```

6. **Configure Supabase Storage:**
   - Create these storage buckets in your Supabase dashboard:
     - `products` — Product images (public)
     - `categories` — Category images (public)
     - `banners` — Hero slides and promo banners (public)
     - `settings` — Store logo and assets (public)
   - Set each bucket's policy to allow public reads and authenticated uploads

7. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🔧 Development Mode

The application includes a comprehensive demo data provider. When Supabase is not configured (or unreachable), the app automatically uses demo data so you can:
- Browse the storefront with sample products
- View the admin dashboard with sample statistics
- Test the cart and checkout flow
- Explore all UI components

Demo data is clearly labeled and not presented as real information.

## 💳 Payment Configuration

### Cash on Delivery
Enabled by default. Configure availability in Admin → Payments.

### bKash / Nagad / Rocket (Manual)
1. Go to Admin → Payment Settings
2. Enable the desired method
3. Enter your account number
4. Add payment instructions for customers
5. Save

During checkout, customers see the payment number and instructions. They enter their sender phone number and transaction ID. **Payments are NOT automatically verified** — admin must manually verify each transaction.

> **Note:** This implementation uses manual payment verification. For API-based bKash/Nagad/Rocket integration, you need official merchant API credentials and additional integration code.

## 📧 External Services (Optional)

### Email Notifications
Configure `EMAIL_SERVICE_API_KEY` in `.env.local` to enable email notifications using Resend, SendGrid, or your preferred provider.

### CAPTCHA
Configure `NEXT_PUBLIC_CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET_KEY` for hCaptcha or Cloudflare Turnstile bot protection.

### SMS OTP
Configure SMS provider credentials for phone number verification. Requires an SMS gateway account (e.g., SSL Wireless, Twilio).

## 📁 Project Structure

```
style-secrets-ecommerce/
├── public/
│   └── images/              # Static assets including logo
├── src/
│   ├── app/
│   │   ├── (storefront)/    # Customer-facing pages
│   │   ├── admin/           # Admin panel pages
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── storefront/      # Storefront components
│   │   ├── admin/           # Admin components
│   │   └── ui/              # Reusable UI components
│   ├── actions/             # Server actions
│   ├── hooks/               # React hooks (cart store)
│   ├── lib/
│   │   ├── supabase/        # Supabase clients
│   │   ├── validators/      # Zod schemas
│   │   └── utils/           # Utility functions
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript types
│   └── middleware.ts        # Auth middleware
├── supabase/
│   └── migrations/          # Database migrations
├── .env.example             # Environment template
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted with `npm run build && npm start`

## 🏪 Currency

The store displays all prices in Bangladesh Taka (৳). Currency formatting is handled by the `formatPrice()` utility function.

## 📋 License

This project is proprietary to Style Secrets.

---

Built with ❤️ for Style Secrets — *Shop Your Style*
