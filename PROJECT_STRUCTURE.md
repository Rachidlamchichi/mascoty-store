# 📁 Mascoty Project Structure

## Complete Directory Tree

```
src/
├── app/
│   ├── (auth)/              # Authentication route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (shop)/              # Shop route group
│   │   ├── productos/
│   │   │   └── page.tsx
│   │   ├── categoria/
│   │   │   └── page.tsx
│   │   ├── carrito/
│   │   │   └── page.tsx
│   │   └── checkout/
│   │       └── page.tsx
│   ├── cuenta/              # User account section
│   │   ├── perfil/
│   │   │   └── page.tsx
│   │   ├── mis-mascotas/
│   │   │   └── page.tsx
│   │   ├── pedidos/
│   │   │   └── page.tsx
│   │   └── suscripciones/
│   │       └── page.tsx
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   │   └── route.ts
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── cart/
│   │   │   └── route.ts
│   │   ├── checkout/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── route.ts
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── favicon.ico
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   └── tabs.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── product/             # Product-related components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductDetail.tsx
│   ├── cart/                # Cart components
│   │   └── CartItem.tsx
│   ├── checkout/            # Checkout components
│   │   └── CheckoutForm.tsx
│   └── shared/              # Shared components
│       └── LoadingSpinner.tsx
│
├── lib/                     # Utilities and configurations
│   ├── supabase/            # Supabase client setup
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Middleware for auth
│   ├── stripe/              # Stripe integration
│   │   ├── client.ts        # Client-side Stripe
│   │   └── server.ts        # Server-side Stripe
│   ├── cloudinary/          # Cloudinary config
│   │   └── config.ts
│   ├── utils.ts             # Utility functions (cn, etc.)
│   └── constants.ts         # App constants
│
├── hooks/                   # Custom React hooks
│   ├── useCart.ts           # Cart management
│   ├── useAuth.ts           # Authentication
│   └── useProducts.ts       # Product fetching
│
├── store/                   # Zustand state management
│   ├── cartStore.ts         # Shopping cart state
│   └── userStore.ts         # User state
│
└── types/                   # TypeScript type definitions
    ├── database.types.ts    # Supabase database types
    ├── product.types.ts     # Product-related types
    └── user.types.ts        # User-related types
```

---

## 🗂️ Directory Descriptions

### **`app/`** - Next.js 15 App Router
- **`(auth)/`** - Route group for authentication (login, register)
- **`(shop)/`** - Route group for shop pages (products, cart, checkout)
- **`cuenta/`** - User account management pages
- **`api/`** - API route handlers for backend logic

### **`components/`** - React Components
- **`ui/`** - shadcn/ui base components (12 components installed)
- **`layout/`** - App layout components (Header, Footer, MobileNav)
- **`product/`** - Product display and filtering components
- **`cart/`** - Shopping cart components
- **`checkout/`** - Checkout flow components
- **`shared/`** - Reusable utility components

### **`lib/`** - Service Integrations & Utilities
- **`supabase/`** - Database and auth client setup
- **`stripe/`** - Payment processing integration
- **`cloudinary/`** - Media management configuration
- **`utils.ts`** - Helper functions (includes `cn()` for Tailwind)
- **`constants.ts`** - App-wide constants and routes

### **`hooks/`** - Custom React Hooks
- **`useCart.ts`** - Shopping cart operations
- **`useAuth.ts`** - Authentication state and user management
- **`useProducts.ts`** - Product fetching and management

### **`store/`** - Zustand State Management
- **`cartStore.ts`** - Global cart state with persistence
- **`userStore.ts`** - Global user state

### **`types/`** - TypeScript Definitions
- **`database.types.ts`** - Supabase database schema types
- **`product.types.ts`** - Product, category, and filter types
- **`user.types.ts`** - User, profile, pet, order, and subscription types

---

## 🎯 Route Groups Explained

### **`(auth)` Group**
Pages in this group share authentication-related layouts without affecting the URL.
- URL: `/login`, `/register` (no `/auth` prefix)

### **`(shop)` Group**
Pages in this group share shop-related layouts.
- URL: `/productos`, `/carrito`, `/checkout` (no `/shop` prefix)

---

## 🔄 API Routes

| Endpoint | Purpose |
|----------|---------|
| `/api/auth` | Authentication endpoints |
| `/api/products` | Product CRUD operations |
| `/api/cart` | Cart management |
| `/api/checkout` | Payment processing |
| `/api/webhooks` | Stripe webhook handling |

---

## 📦 Installed Packages

### Core
- Next.js 16.0.1
- React 19.2.0
- TypeScript 5.x

### UI & Styling
- Tailwind CSS V4
- shadcn/ui components (12)
- Framer Motion
- Lucide React

### State & Forms
- Zustand (with persist)
- React Hook Form
- Zod

### Backend & Database
- Supabase (@supabase/ssr) ✅
- Prisma + Prisma Client

### Payments & Media
- Stripe (client + server)
- Cloudinary

---

## 🚀 Next Steps

1. **Define Prisma Schema** (`prisma/schema.prisma`)
2. **Implement API Routes** (products, cart, checkout)
3. **Build Component Logic** (connect to stores and APIs)
4. **Add Authentication Flow** (Supabase Auth + NextAuth)
5. **Implement Payment Processing** (Stripe checkout)
6. **Add Image Uploads** (Cloudinary integration)

---

## 📝 Notes

- All route groups use Next.js 15 App Router conventions
- Components use TypeScript with strict mode
- State management combines Zustand (client) + Supabase (server)
- shadcn/ui components are customizable and located in `components/ui/`
- API routes follow RESTful conventions

---

**Last Updated:** November 10, 2025
