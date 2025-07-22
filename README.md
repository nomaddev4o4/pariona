# 🌍 Pariona - Global Pricing Intelligence Platform

> **⚠️ Disclaimer**: This project is built as a **portfolio showcase** to demonstrate my full-stack development skills and is **not intended for actual SaaS business purposes**. It serves as a comprehensive example of modern web application architecture and best practices.

**Pariona** is a sophisticated SaaS platform that enables businesses to implement Purchase Power Parity (PPP) based pricing strategies. The platform automatically detects user locations and displays country-specific discount banners to maximize global sales conversion.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?style=flat-square&logo=postgresql)

## ✨ Key Features

### 🎯 Core Functionality
- **Geolocation-Based Pricing**: Automatically detects visitor countries using Vercel's geolocation API
- **Dynamic Discount Banners**: Server-rendered banners with customizable messaging and styling
- **PPP Country Grouping**: Intelligent grouping of countries based on purchasing power parity
- **Embeddable JavaScript Widget**: Simple integration with any website via script tags

### 📊 Analytics & Insights
- **Real-time Analytics Dashboard**: Track banner views, conversions, and geographic performance
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Country-wise Performance**: Detailed breakdowns by geography and discount tiers
- **Timezone-aware Reporting**: Accurate analytics across different time zones

### 🔐 Authentication & Authorization
- **Clerk Integration**: Robust authentication with social login support
- **Role-based Permissions**: Granular access control for different features
- **Secure API Routes**: Protected endpoints with proper authentication middleware

### 💳 Subscription Management
- **Stripe Integration**: Complete payment processing and subscription management
- **Tiered Pricing Plans**: Free, Basic, Standard, and Premium tiers
- **Usage Monitoring**: Track API calls, products, and feature access
- **Automatic Billing**: Webhook-based subscription lifecycle management

### 🎨 User Experience
- **Modern UI/UX**: Built with shadcn/ui and Radix UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: System-aware theme switching
- **Form Validation**: Comprehensive validation using Zod and React Hook Form

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5.0 for type safety
- **Styling**: Tailwind CSS 4.0 with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend & Database
- **API**: Next.js API Routes with TypeScript
- **Database**: PostgreSQL (Neon) with connection pooling
- **ORM**: Drizzle ORM with type-safe queries
- **Caching**: React Cache and Next.js unstable_cache
- **Geolocation**: Vercel Functions geolocation API

### Authentication & Payments
- **Auth Provider**: Clerk (Social login, JWT tokens)
- **Payment Processing**: Stripe (Subscriptions, Webhooks)
- **Webhook Security**: Signature verification and idempotency

### DevOps & Tooling
- **Deployment**: Vercel with edge functions
- **Database Migrations**: Drizzle Kit
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Development**: Hot reload, TypeScript incremental compilation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Stripe account for payments

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/pariona-shadcn.git
cd pariona-shadcn
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment variables**
Create a `.env.local` file with the following variables:
```bash
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Price IDs
STRIPE_BASIC_PLAN_STRIPE_PRICE_ID="price_..."
STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID="price_..."
STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID="price_..."

# App Configuration
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
TEST_COUNTRY_CODE="US"
```

4. **Database setup**
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Optional: Update country groupings
npm run db:updateCountryGroups
```

5. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (marketing)/       # Landing page
│   ├── dashboard/         # Main application
│   └── api/               # API routes
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── data/                 # Static data and configurations
├── db/                   # Database schema and migrations
├── lib/                  # Utility functions
├── schemas/              # Zod validation schemas
└── server/               # Server-side logic
    ├── actions/          # Server actions
    ├── db/              # Database queries
    └── permissions.ts    # Authorization logic
```

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack

# Building
npm run build           # Create production build
npm run start           # Start production server

# Database
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Drizzle Studio

# Tools
npm run lint            # Run ESLint
npm run stripe:webhook  # Start Stripe webhook listener
```

## 🔧 Key Implementation Highlights

### Geolocation-Based Banner System
The core feature uses Vercel's edge functions to detect user location and serve personalized discount banners:

```typescript
// Real-time country detection
const { country } = geolocation(request);

// Dynamic banner generation
const banner = renderToStaticMarkup(
  createElement(Banner, {
    message: product.customization.locationMessage,
    mappings: { country, coupon, discount },
    customization: product.customization
  })
);
```

### Type-Safe Database Queries
Uses Drizzle ORM with TypeScript for complete type safety:

```typescript
const products = await db.query.ProductTable.findMany({
  where: eq(ProductTable.clerkUserId, userId),
  with: {
    productCustomization: true,
    countryGroupDiscounts: true
  }
});
```

### Caching Strategy
Implements multi-layer caching for optimal performance:

```typescript
export function dbCache<Args, Return>(
  cb: (...args: Args) => Promise<Return>,
  { tags }: { tags: ValidTags[] }
) {
  return cache(unstable_cache(cb, undefined, { tags }));
}
```

## 🎨 Design System

The application uses a comprehensive design system built on:
- **Color Palette**: Semantic color tokens with dark/light mode support
- **Typography**: Custom font stack with Cabinet Grotesk and Switzer
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Accessible components following ARIA guidelines

## 📈 Performance Optimizations

- **Edge Runtime**: API routes deployed to Vercel Edge for global performance
- **Static Generation**: Marketing pages pre-rendered at build time
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting and lazy loading
- **Caching**: Strategic use of React Cache and Next.js caching

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Please feel free to:
- Open issues for bugs or feature suggestions
- Submit pull requests for improvements
- Provide feedback on code structure and implementation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Krishna as a demonstration of modern full-stack development capabilities.**

*This application showcases proficiency in React, Next.js, TypeScript, PostgreSQL, Stripe integration, real-time analytics, and modern web development best practices.*
