# ⚙️ Configurar Prisma - Guía Completa

## 🎯 Objetivo

Configurar Prisma ORM con Supabase PostgreSQL para gestionar la base de datos de Mascoty.

---

## ✅ Requisitos Previos

1. ✅ Variables de entorno configuradas en `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

2. ✅ Supabase proyecto creado

3. ✅ Node.js instalado

---

## 🚀 Paso a Paso

### **Paso 1: Instalar Dependencias**

```bash
npm install ts-node --save-dev
```

### **Paso 2: Verificar .env.local**

Asegúrate de que tu archivo `.env.local` tiene estas variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tbijzzdjjruegjlyebmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Database URLs para Prisma
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[TU_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**⚠️ IMPORTANTE:** Reemplaza `[TU_PASSWORD]` con tu contraseña real de Supabase.

### **Paso 3: Generar Cliente Prisma**

```bash
npm run prisma:generate
```

**Salida esperada:**
```
✔ Generated Prisma Client
```

### **Paso 4: Push Schema a Supabase**

```bash
npm run prisma:push
```

**Salida esperada:**
```
✔ Your database is now in sync with your Prisma schema
```

**Esto creará todas las tablas:**
- ✅ users
- ✅ addresses
- ✅ pets
- ✅ categories
- ✅ products
- ✅ cart_items
- ✅ wishlist_items
- ✅ orders
- ✅ order_items
- ✅ reviews
- ✅ subscriptions

### **Paso 5: Seed (Datos Iniciales)**

```bash
npm run prisma:seed
```

**Esto creará:**
- 📂 8 categorías
- 🛍️ 8 productos de ejemplo
- 🏷️ Productos con imágenes y descripciones

**Salida esperada:**
```
🌱 Seeding database...
📂 Creating categories...
🛍️ Creating products...
✅ Seeding completed successfully!
📂 8 products created
📁 8 categories created
```

### **Paso 6: Verificar en Prisma Studio**

```bash
npm run prisma:studio
```

**Se abrirá en:** http://localhost:5555

**Aquí puedes:**
- 👀 Ver todos los datos
- ✏️ Editar registros
- ➕ Agregar nuevos
- 🗑️ Eliminar

---

## 🎯 Comando Todo-en-Uno

Si quieres hacer todo de una vez:

```bash
npm run db:setup
```

**Esto ejecuta:**
1. `prisma generate` - Genera cliente
2. `prisma db push` - Crea tablas
3. `npm run prisma:seed` - Inserta datos

---

## 📊 Verificar Base de Datos

### **Opción 1: Prisma Studio** (Recomendado)
```bash
npm run prisma:studio
```

### **Opción 2: Supabase Dashboard**
1. Ve a: https://supabase.com/dashboard/project/tbijzzdjjruegjlyebmk
2. Clic en "Table Editor"
3. Verás todas las tablas creadas

### **Opción 3: SQL Editor**
```sql
-- Ver categorías
SELECT * FROM categories;

-- Ver productos
SELECT * FROM products;

-- Ver productos con su categoría
SELECT 
  p.name as producto,
  c.name as categoria,
  p.price,
  p.stock
FROM products p
JOIN categories c ON p.category_id = c.id;
```

---

## 🔧 Comandos Útiles

### **Generar Cliente:**
```bash
npm run prisma:generate
```

### **Push Schema (sin migraciones):**
```bash
npm run prisma:push
```

### **Ver BD en navegador:**
```bash
npm run prisma:studio
```

### **Seed datos:**
```bash
npm run prisma:seed
```

### **Reset completo:**
```bash
npx prisma migrate reset
```
⚠️ **Esto borra TODOS los datos!**

---

## 📝 Uso en Código

### **Crear cliente Prisma:**

Crea `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### **Usar en API Routes:**

```typescript
import { prisma } from '@/lib/prisma';

// GET /api/products
export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    where: {
      status: 'ACTIVE',
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return Response.json(products);
}
```

### **Ejemplos de Queries:**

```typescript
// Buscar productos
const products = await prisma.product.findMany({
  where: {
    category: {
      slug: 'perros',
    },
    price: {
      lte: 50, // <= 50
    },
    stock: {
      gt: 0, // > 0
    },
  },
  include: {
    category: true,
    reviews: true,
  },
  take: 10, // Límite
});

// Crear usuario
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Juan Pérez',
    auth_id: 'supabase-auth-id',
    tier: 'BRONZE',
  },
});

// Agregar al carrito
const cartItem = await prisma.cartItem.upsert({
  where: {
    user_id_product_id: {
      user_id: userId,
      product_id: productId,
    },
  },
  update: {
    quantity: {
      increment: 1,
    },
  },
  create: {
    user_id: userId,
    product_id: productId,
    quantity: 1,
  },
});

// Crear pedido
const order = await prisma.order.create({
  data: {
    order_number: `ORD-${Date.now()}`,
    user_id: userId,
    address_id: addressId,
    subtotal: 99.98,
    tax: 21.00,
    shipping_cost: 5.00,
    total: 125.98,
    status: 'PENDING',
    items: {
      create: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      })),
    },
  },
  include: {
    items: {
      include: {
        product: true,
      },
    },
  },
});
```

---

## 🐛 Troubleshooting

### **Error: "Missing DATABASE_URL"**

**Solución:**
```bash
# Verifica que .env.local existe y tiene DATABASE_URL
cat .env.local | grep DATABASE_URL

# Si no está, agrégala:
echo 'DATABASE_URL="postgresql://..."' >> .env.local
```

### **Error: "Schema drift detected"**

**Solución:**
```bash
# Push schema nuevamente
npm run prisma:push
```

### **Error: "Can't reach database server"**

**Solución:**
1. Verifica que tu contraseña es correcta
2. Verifica que estás online
3. Verifica el proyecto de Supabase: https://supabase.com/dashboard

### **Error: "Module not found: ts-node"**

**Solución:**
```bash
npm install ts-node --save-dev
```

### **Tablas no aparecen en Supabase**

**Solución:**
```bash
# Force push
npx prisma db push --force-reset
```
⚠️ Esto borra datos existentes!

---

## 📚 Documentación Adicional

- **Schema completo:** `PRISMA_SCHEMA.md`
- **Modelos TypeScript:** `src/types/database.types.ts`
- **Ejemplos de uso:** Ver `PRISMA_SCHEMA.md`

---

## ✅ Checklist de Configuración

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ `npm install` ejecutado
- [ ] ✅ `npm run prisma:generate` exitoso
- [ ] ✅ `npm run prisma:push` exitoso
- [ ] ✅ `npm run prisma:seed` exitoso
- [ ] ✅ Prisma Studio abre correctamente
- [ ] ✅ Tablas visibles en Supabase Dashboard
- [ ] ✅ Datos de seed visibles

---

## 🎉 Próximos Pasos

Una vez configurado Prisma:

1. **Crear API Routes:**
   - `/api/products` - Listar productos
   - `/api/products/[id]` - Detalle producto
   - `/api/cart` - Gestionar carrito
   - `/api/orders` - Crear pedidos

2. **Integrar en Frontend:**
   ```typescript
   // Fetch productos
   const response = await fetch('/api/products');
   const products = await response.json();
   ```

3. **Implementar Auth:**
   - Conectar Supabase Auth con User table
   - Crear usuario en DB al registrarse

4. **Agregar funcionalidad:**
   - Add to cart
   - Wishlist
   - Reviews
   - Orders

---

**✨ Prisma configurado y listo para usar!** 🚀

**Siguiente:** Crear API Routes y conectar con el frontend.
