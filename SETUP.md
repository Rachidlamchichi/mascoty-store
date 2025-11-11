# 🚀 Mascoty - Setup Guide

## ✅ Environment Configuration Completed

### Files Created

#### `.env.local` (Development - Git Ignored)
Contains all environment variables for local development:
- ✅ Supabase URL and Anon Key
- ✅ Database URLs (PostgreSQL via Supabase)
- 🔲 Stripe keys (to be added)
- 🔲 Cloudinary credentials (to be added)
- 🔲 NextAuth secret (to be generated)

#### `.env` (Prisma - Git Ignored)
Contains database URLs for Prisma:
- ✅ DATABASE_URL
- ✅ DIRECT_URL

---

## 🔐 Security Status

Both `.env` and `.env.local` are **automatically ignored by Git** (via `.gitignore` line 34: `.env*`)

⚠️ **Never commit these files to version control!**

---

## 📝 Pending Configuration

### 1. **Stripe Integration**
To enable payments, add these to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Get your keys from:** https://dashboard.stripe.com/test/apikeys

### 2. **Cloudinary Media Management**
To enable image uploads, add these to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get your credentials from:** https://cloudinary.com/console

### 3. **NextAuth Secret**
Generate a secure secret for NextAuth:

```bash
# Run this command in PowerShell:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then add to `.env.local`:
```bash
NEXTAUTH_SECRET=<generated_secret>
```

---

## 🗄️ Database Connection Verified

### Supabase PostgreSQL
- **Host:** `db.yjlqykfhjjubneiradfg.supabase.co`
- **Database:** `postgres`
- **Port:** `5432`

### Next Steps for Database:

1. **Define Prisma Schema** (`prisma/schema.prisma`)
2. **Create Initial Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

---

## 🎯 Quick Start Commands

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Build for production
npm run build
```

---

## 📦 Current Stack Status

| Component | Status | Version |
|-----------|--------|---------|
| Next.js | ✅ Installed | 16.0.1 |
| React | ✅ Installed | 19.2.0 |
| TypeScript | ✅ Configured | 5.x |
| Tailwind CSS | ✅ Configured | V4 |
| shadcn/ui | ✅ Configured | Latest |
| Supabase | ✅ Connected | Latest |
| Prisma | ✅ Initialized | 6.19.0 |
| Stripe | 🔲 Pending Keys | 19.3.0 |
| Cloudinary | 🔲 Pending Keys | 2.8.0 |

---

## 🔄 Development Workflow

1. **Start dev server:** `npm run dev`
2. **Access app:** http://localhost:3000
3. **Prisma Studio:** `npx prisma studio` → http://localhost:5555

---

## 🛠️ Troubleshooting

### If you see Prisma errors:
```bash
npx prisma generate
```

### If environment variables aren't loading:
- Restart your dev server
- Check `.env.local` exists in root directory

### Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

## 📚 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Stripe Docs](https://stripe.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Last Updated:** November 10, 2025
