# Marketplace Platform Documentation

## Technical Overview
This platform is built with **Next.js 14+ (App Router)**, **Prisma**, and **TiDB Cloud**. It features a modern D2C storefront and a robust Enterprise Admin Dashboard.

### Tech Stack
- **Frontend**: Next.js, TailwindCSS, Lucide/Material Symbols.
- **Backend**: Next.js Server Actions, API Routes.
- **Database**: TiDB Cloud (MySQL compatible) via Prisma.
- **Auth**: Auth.js (NextAuth v5).
- **Testing**: Vitest (Unit), Playwright (E2E).

## Setup Guide
1. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: TiDB connection string.
   - `AUTH_SECRET`: Secret for session encryption.
   - `MIDTRANS_SERVER_KEY`: For payments.
2. **Installation**:
   ```bash
   npm install
   npx prisma generate
   ```
3. **Database Setup**:
   ```bash
   npx prisma db push
   ```

## User Manual
### Storefront
- **Katalog**: Browse products, use search and categories.
- **Checkout**: Add products to cart and proceed to checkout with Midtrans integration.
- **Account**: Track orders and manage profile.
- **Reviews**: Leave reviews for products you've received.

### Admin Dashboard
- **Overview**: Real-time KPI and sales charts.
- **Inventory**: Manage products, stock, and B2B pricing.
- **Orders**: Update status and input tracking numbers.
- **Customers**: View customer details and activity.
- **Reports**: Advanced analytics for operational precision.

## Security Features
- **SQL Injection**: Prevented by Prisma's parameterized queries.
- **XSS**: Default protection via React rendering.
- **Rate Limiting**: Implemented via middleware for sensitive endpoints.
- **CSRF**: Built-in protection for Server Actions.
