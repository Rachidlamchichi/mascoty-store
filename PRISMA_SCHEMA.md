# 🗄️ Prisma Schema - Mascoty Database

## 📋 Resumen

Schema completo de base de datos para Mascoty con **11 modelos** y **6 enums**.

---

## 🏗️ Estructura de Modelos

### **1. User & Authentication** 👤

#### **User**
Usuario principal del sistema con programa de lealtad.

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  avatar_url    String?
  phone         String?
  
  // Supabase Auth ID
  auth_id       String    @unique
  
  // Loyalty Program
  points        Int       @default(0)
  tier          UserTier  @default(BRONZE)
  
  // Relations
  addresses     Address[]
  pets          Pet[]
  orders        Order[]
  reviews       Review[]
  subscriptions Subscription[]
  cart          CartItem[]
  wishlist      WishlistItem[]
}
```

**Características:**
- ✅ Integración con Supabase Auth
- ✅ Programa de puntos y niveles (Bronze, Silver, Gold)
- ✅ Múltiples direcciones
- ✅ Gestión de mascotas
- ✅ Historial de pedidos y reseñas

#### **Address**
Direcciones de envío del usuario.

```prisma
model Address {
  id              String   @id @default(uuid())
  user_id         String
  street          String
  street2         String?
  city            String
  state           String
  postal_code     String
  country         String   @default("España")
  is_default      Boolean  @default(false)
}
```

**Características:**
- ✅ Múltiples direcciones por usuario
- ✅ Dirección predeterminada
- ✅ Completo con calle, ciudad, código postal

---

### **2. Pets** 🐕

#### **Pet**
Mascotas del usuario con información médica.

```prisma
model Pet {
  id            String    @id @default(uuid())
  user_id       String
  name          String
  type          PetType
  breed         String?
  size          PetSize?
  birth_date    DateTime?
  weight        Float?
  image_url     String?
  
  // Medical Info
  allergies     String[]
  medical_notes String?
}
```

**Tipos de Mascotas:**
- 🐕 DOG (Perro)
- 🐈 CAT (Gato)
- 🐦 BIRD (Ave)
- 🐠 FISH (Pez)
- 🐰 RABBIT (Conejo)
- 🐹 HAMSTER (Hámster)
- 🦎 OTHER (Otros)

**Tamaños:**
- SMALL (Pequeño)
- MEDIUM (Mediano)
- LARGE (Grande)
- EXTRA_LARGE (Extra Grande)

**Características:**
- ✅ Información médica (alergias, notas)
- ✅ Imagen de la mascota
- ✅ Fecha de nacimiento y peso
- ✅ Asociado a suscripciones

---

### **3. Products & Categories** 🛍️

#### **Category**
Categorías jerárquicas de productos.

```prisma
model Category {
  id            String    @id @default(uuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  image_url     String?
  icon          String?
  
  parent_id     String?
  parent        Category?
  children      Category[]
}
```

**Características:**
- ✅ Categorías anidadas (padre-hijo)
- ✅ Slug para URLs amigables
- ✅ Icono y imagen personalizados

**Ejemplos de Estructura:**
```
Perros (padre)
├─ Alimentos (hijo)
│  ├─ Comida Seca
│  └─ Comida Húmeda
├─ Accesorios
└─ Juguetes
```

#### **Product**
Productos completos con inventario y SEO.

```prisma
model Product {
  id              String        @id @default(uuid())
  name            String
  slug            String        @unique
  description     String?
  
  // Pricing
  price           Float
  original_price  Float?
  cost            Float?
  
  // Inventory
  sku             String?       @unique
  stock           Int           @default(0)
  status          ProductStatus @default(ACTIVE)
  
  // Media
  images          String[]
  thumbnail       String?
  
  // SEO
  meta_title      String?
  meta_desc       String?
  
  // Classification
  category_id     String
  tags            String[]
  
  // Physical
  weight          Float?
  dimensions      String?
}
```

**Estados del Producto:**
- ✅ ACTIVE (Activo)
- ⏸️ INACTIVE (Inactivo)
- 📦 OUT_OF_STOCK (Agotado)
- ❌ DISCONTINUED (Descontinuado)

**Características:**
- ✅ Múltiples imágenes
- ✅ Precio original para mostrar descuentos
- ✅ SKU único
- ✅ Control de inventario
- ✅ SEO optimizado (meta tags)
- ✅ Tags para filtrado
- ✅ Dimensiones y peso para envío

---

### **4. Cart & Wishlist** 🛒💛

#### **CartItem**
Items en el carrito de compras.

```prisma
model CartItem {
  id          String   @id @default(uuid())
  user_id     String
  product_id  String
  quantity    Int      @default(1)
  
  @@unique([user_id, product_id])
}
```

**Características:**
- ✅ Un producto por usuario (unique)
- ✅ Cantidad ajustable
- ✅ Actualización automática de timestamps

#### **WishlistItem**
Lista de deseos del usuario.

```prisma
model WishlistItem {
  id          String   @id @default(uuid())
  user_id     String
  product_id  String
  
  @@unique([user_id, product_id])
}
```

**Características:**
- ✅ Un producto por usuario
- ✅ Fecha de agregado
- ✅ Fácil conversión a carrito

---

### **5. Orders** 📦

#### **Order**
Pedido completo con pagos y envío.

```prisma
model Order {
  id                String      @id @default(uuid())
  order_number      String      @unique
  user_id           String
  address_id        String
  
  // Pricing
  subtotal          Float
  tax               Float
  shipping_cost     Float
  discount          Float
  total             Float
  
  // Status
  status            OrderStatus
  
  // Payment
  payment_method    String?
  payment_intent_id String?
  paid_at           DateTime?
  
  // Shipping
  tracking_number   String?
  shipped_at        DateTime?
  delivered_at      DateTime?
  
  items             OrderItem[]
}
```

**Estados del Pedido:**
1. ⏳ PENDING (Pendiente)
2. ✅ CONFIRMED (Confirmado)
3. 🔄 PROCESSING (Procesando)
4. 📦 SHIPPED (Enviado)
5. 🎉 DELIVERED (Entregado)
6. ❌ CANCELLED (Cancelado)
7. 💰 REFUNDED (Reembolsado)

**Características:**
- ✅ Número de pedido único
- ✅ Desglose completo de precios
- ✅ Integración con Stripe (payment_intent_id)
- ✅ Tracking de envío
- ✅ Múltiples items por pedido
- ✅ Historial de fechas

#### **OrderItem**
Items individuales del pedido.

```prisma
model OrderItem {
  id          String   @id @default(uuid())
  order_id    String
  product_id  String
  quantity    Int
  price       Float
  subtotal    Float
}
```

**Características:**
- ✅ Precio congelado al momento de compra
- ✅ Subtotal calculado
- ✅ Referencia al producto

---

### **6. Reviews** ⭐

#### **Review**
Reseñas de productos por usuarios.

```prisma
model Review {
  id          String   @id @default(uuid())
  user_id     String
  product_id  String
  rating      Int      // 1-5
  title       String?
  comment     String?
  verified    Boolean  @default(false)
  
  @@unique([user_id, product_id])
}
```

**Características:**
- ✅ Rating de 1 a 5 estrellas
- ✅ Título opcional
- ✅ Comentario opcional
- ✅ Verificación de compra
- ✅ Una reseña por usuario/producto

---

### **7. Subscriptions** 🔄

#### **Subscription**
Suscripciones recurrentes de productos.

```prisma
model Subscription {
  id                  String             @id @default(uuid())
  user_id             String
  pet_id              String?
  product_id          String
  
  // Schedule
  frequency           Int                // Days
  quantity            Int
  
  // Pricing
  price               Float
  discount_percent    Float
  
  // Status
  status              SubscriptionStatus
  
  // Dates
  start_date          DateTime
  next_delivery_date  DateTime
  paused_until        DateTime?
  cancelled_at        DateTime?
  
  // Stripe
  stripe_subscription_id String?
}
```

**Estados:**
- ✅ ACTIVE (Activa)
- ⏸️ PAUSED (Pausada)
- ❌ CANCELLED (Cancelada)
- ⏰ EXPIRED (Expirada)

**Características:**
- ✅ Entrega automática cada X días
- ✅ Descuento por suscripción
- ✅ Asociado a mascota específica
- ✅ Integración con Stripe Subscriptions
- ✅ Pausar temporalmente
- ✅ Próxima fecha de entrega

---

## 📊 Diagrama de Relaciones

```
User
├── Address (1:N)
├── Pet (1:N)
│   └── Subscription (1:N)
├── Order (1:N)
│   └── OrderItem (1:N)
│       └── Product
├── CartItem (1:N)
│   └── Product
├── WishlistItem (1:N)
│   └── Product
├── Review (1:N)
│   └── Product
└── Subscription (1:N)
    └── Product

Category
├── Product (1:N)
└── Category (self-reference, hierarchy)

Product
├── CartItem (1:N)
├── WishlistItem (1:N)
├── OrderItem (1:N)
├── Review (1:N)
└── Subscription (1:N)
```

---

## 🔧 Comandos Prisma

### **Generar Cliente:**
```bash
npx prisma generate
```

### **Ver Base de Datos:**
```bash
npx prisma studio
```

### **Push Schema (sin migración):**
```bash
npx prisma db push
```

### **Crear Migración:**
```bash
npx prisma migrate dev --name init
```

### **Reset Base de Datos:**
```bash
npx prisma migrate reset
```

---

## 📝 Uso del Cliente Prisma

### **Importar:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

### **Crear Usuario:**
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Juan Pérez',
    auth_id: 'supabase-auth-id',
    tier: 'BRONZE',
    points: 0,
  },
});
```

### **Crear Mascota:**
```typescript
const pet = await prisma.pet.create({
  data: {
    user_id: user.id,
    name: 'Max',
    type: 'DOG',
    breed: 'Labrador',
    size: 'LARGE',
    weight: 30.5,
  },
});
```

### **Crear Producto:**
```typescript
const product = await prisma.product.create({
  data: {
    name: 'Alimento Premium para Perros',
    slug: 'alimento-premium-perros',
    description: 'Alimento balanceado...',
    price: 49.99,
    original_price: 59.99,
    stock: 100,
    category_id: categoryId,
    images: ['image1.jpg', 'image2.jpg'],
    tags: ['perros', 'alimento', 'premium'],
  },
});
```

### **Agregar al Carrito:**
```typescript
const cartItem = await prisma.cartItem.create({
  data: {
    user_id: user.id,
    product_id: product.id,
    quantity: 2,
  },
});
```

### **Crear Pedido:**
```typescript
const order = await prisma.order.create({
  data: {
    order_number: 'ORD-2024-001',
    user_id: user.id,
    address_id: address.id,
    subtotal: 99.98,
    tax: 21.00,
    shipping_cost: 5.00,
    total: 125.98,
    status: 'PENDING',
    items: {
      create: [
        {
          product_id: product.id,
          quantity: 2,
          price: 49.99,
          subtotal: 99.98,
        },
      ],
    },
  },
  include: {
    items: true,
  },
});
```

### **Consultas con Relaciones:**
```typescript
// Usuario con sus mascotas
const userWithPets = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    pets: true,
    addresses: true,
  },
});

// Producto con categoría y reseñas
const productDetail = await prisma.product.findUnique({
  where: { slug: 'alimento-premium-perros' },
  include: {
    category: true,
    reviews: {
      include: {
        user: true,
      },
    },
  },
});

// Pedidos del usuario
const userOrders = await prisma.order.findMany({
  where: { user_id: userId },
  include: {
    items: {
      include: {
        product: true,
      },
    },
    address: true,
  },
  orderBy: {
    created_at: 'desc',
  },
});
```

---

## 🎯 Features del Schema

### **1. Cascading Deletes:**
```prisma
// Cuando se borra un usuario:
onDelete: Cascade  // Se borran sus pets, addresses, cart, etc.

// Cuando se borra un producto:
onDelete: Cascade  // Se borran los cart items
```

### **2. Unique Constraints:**
```prisma
// Un usuario solo puede tener un producto en el carrito
@@unique([user_id, product_id])

// Un usuario solo puede reseñar un producto una vez
@@unique([user_id, product_id])
```

### **3. Default Values:**
```prisma
@default(uuid())       // ID único automático
@default(now())        // Fecha actual
@default(0)            // Puntos = 0
@default(BRONZE)       // Tier = Bronze
@default(false)        // Boolean = false
@default("España")     // País por defecto
```

### **4. Auto-update:**
```prisma
updated_at DateTime @updatedAt  // Se actualiza automáticamente
```

---

## 📈 Optimizaciones

### **Índices Sugeridos:**
```prisma
// En User
@@index([email])
@@index([auth_id])

// En Product
@@index([slug])
@@index([category_id])
@@index([status])

// En Order
@@index([user_id])
@@index([status])
@@index([order_number])
```

---

## 🔒 Seguridad

### **RLS en Supabase:**
Aunque Prisma maneja las relaciones, debes configurar RLS en Supabase:

```sql
-- Users pueden ver solo sus datos
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- Similar para otras tablas
```

---

## 🚀 Próximos Pasos

1. **Configurar variables de entorno:**
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

2. **Generar cliente:**
   ```bash
   npx prisma generate
   ```

3. **Push schema a Supabase:**
   ```bash
   npx prisma db push
   ```

4. **Inicializar datos:**
   ```bash
   npm run seed
   ```

---

## 📚 Recursos

- **Prisma Docs:** https://www.prisma.io/docs
- **Prisma Client API:** https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- **Supabase + Prisma:** https://www.prisma.io/docs/guides/database/supabase

---

**✨ Schema completo y listo para usar!** 🚀
