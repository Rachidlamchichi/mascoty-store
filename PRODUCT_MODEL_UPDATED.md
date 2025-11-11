# 🛍️ Modelo Product Actualizado - E-commerce Completo

## 🎯 Cambios Implementados

Se ha actualizado el modelo Product con un sistema completo de e-commerce para productos de mascotas, incluyendo categorización avanzada, analytics y campos específicos para mascotas.

---

## 📝 Nuevos Modelos

### **Brand (Nuevo)**
```prisma
model Brand {
  id            String    @id @default(uuid())
  name          String    @unique
  slug          String    @unique
  description   String?   @db.Text
  logo_url      String?
  website_url   String?
  is_active     Boolean   @default(true)
  products      Product[]
}
```

**Características:**
- ✅ Marcas de productos
- ✅ Logo y sitio web
- ✅ Soft delete y timestamps
- ✅ Índices optimizados

---

## 🆕 Nuevos Enums

### **AgeGroup**
```prisma
enum AgeGroup {
  PUPPY_KITTEN  // Cachorros/Gatitos
  ADULT         // Adultos
  SENIOR        // Mayores
}
```

### **PetSize (Actualizado)**
```prisma
enum PetSize {
  MINI    // < 5kg
  SMALL   // 5-10kg
  MEDIUM  // 10-25kg
  LARGE   // 25-45kg
  GIANT   // > 45kg
}
```

---

## 🔄 Cambios en Product

### **1. Campos Renombrados**

| Antes | Después | Motivo |
|-------|---------|--------|
| `short_desc` | `short_description` | Más descriptivo |
| `original_price` | `compare_price` | Estándar e-commerce |
| `meta_desc` | `meta_description` | Consistencia |

### **2. Campos Nuevos**

#### **Inventory:**
```prisma
low_stock_alert   Int  @default(10)  // Alerta de stock bajo
```

#### **Categorization:**
```prisma
brand_id          String?
brand             Brand?    // Relación con marca
```

#### **Pet Specific:**
```prisma
species           PetSpecies[]  // Especies adecuadas
age_group         AgeGroup[]    // Edades adecuadas
size_suitable     PetSize[]     // Tamaños adecuados
```

#### **Product Details:**
```prisma
dimensions        Json?         // {length, width, height}
ingredients       String?       @db.Text
nutritional_info  Json?         // Info nutricional estructurada
benefits          String[]      // Beneficios del producto
usage_instructions String?      @db.Text
```

#### **Analytics:**
```prisma
views_count       Int    @default(0)
sales_count       Int    @default(0)
rating_avg        Float  @default(0)
review_count      Int    @default(0)
```

#### **Status:**
```prisma
is_active         Boolean  @default(true)
is_featured       Boolean  @default(false)
is_subscription   Boolean  @default(false)
```

### **3. Índices Adicionales**

```prisma
@@index([brand_id])         // Filtrar por marca
@@index([is_active])        // Productos activos
@@index([is_featured])      // Productos destacados
@@index([rating_avg])       // Ordenar por rating
@@index([sales_count])      // Productos más vendidos
```

**Total índices:** 11 (optimización máxima)

---

## 📋 Modelo Completo

```prisma
model Product {
  id                String        @id @default(uuid())
  
  // Basic Info
  name              String
  slug              String        @unique
  description       String        @db.Text
  short_description String?
  
  // Pricing
  price             Float
  compare_price     Float?        // precio tachado
  cost              Float?        // costo para calcular margen
  
  // Inventory
  sku               String        @unique
  stock             Int           @default(0)
  low_stock_alert   Int           @default(10)
  
  // Media
  images            String[]      // URLs de Cloudinary
  thumbnail         String?
  
  // Categorization
  category_id       String
  category          Category
  brand_id          String?
  brand             Brand?
  tags              String[]
  
  // Pet Specific
  species           PetSpecies[]
  age_group         AgeGroup[]
  size_suitable     PetSize[]
  
  // Product Details
  weight            Float?        // peso en kg
  dimensions        Json?         // {length, width, height}
  ingredients       String?       @db.Text
  nutritional_info  Json?
  benefits          String[]
  usage_instructions String?      @db.Text
  
  // SEO
  meta_title        String?
  meta_description  String?
  
  // Analytics
  views_count       Int           @default(0)
  sales_count       Int           @default(0)
  rating_avg        Float         @default(0)
  review_count      Int           @default(0)
  
  // Status
  is_active         Boolean       @default(true)
  is_featured       Boolean       @default(false)
  is_subscription   Boolean       @default(false)
  
  // Relations
  reviews           Review[]
  order_items       OrderItem[]
  cart_items        CartItem[]
  wishlist_items    WishlistItem[]
  subscriptions     Subscription[]
  
  // Timestamps + Soft Delete
  created_at        DateTime      @default(now())
  updated_at        DateTime      @updatedAt
  deleted_at        DateTime?
  
  // 11 Índices optimizados
  @@index([category_id])
  @@index([brand_id])
  @@index([slug])
  @@index([is_active])
  @@index([is_featured])
  @@index([price])
  @@index([stock])
  @@index([rating_avg])
  @@index([sales_count])
  @@index([created_at])
  @@index([name])
}
```

---

## 💡 Ejemplos de Uso

### **Crear Producto Completo:**
```typescript
const product = await prisma.product.create({
  data: {
    name: 'Alimento Premium para Perros Adultos',
    slug: 'alimento-premium-perros-adultos',
    description: 'Alimento balanceado premium con ingredientes naturales...',
    short_description: 'Alimento premium para perros adultos de razas medianas',
    
    // Pricing
    price: 49.99,
    compare_price: 59.99,  // Precio tachado
    cost: 30.00,           // Margen: 66%
    
    // Inventory
    sku: 'DOG-FOOD-001',
    stock: 150,
    low_stock_alert: 20,
    
    // Media
    images: [
      'https://res.cloudinary.com/.../image1.jpg',
      'https://res.cloudinary.com/.../image2.jpg',
    ],
    thumbnail: 'https://res.cloudinary.com/.../thumb.jpg',
    
    // Categorization
    category_id: categoryId,
    brand_id: brandId,
    tags: ['premium', 'natural', 'sin gluten'],
    
    // Pet Specific
    species: ['DOG'],
    age_group: ['ADULT'],
    size_suitable: ['MEDIUM', 'LARGE'],
    
    // Product Details
    weight: 15.0,
    dimensions: {
      length: 45,
      width: 30,
      height: 15,
    },
    ingredients: 'Pollo 40%, Arroz integral 20%, Verduras 15%...',
    nutritional_info: {
      protein: 28,
      fat: 15,
      fiber: 4,
      moisture: 10,
      calories: 3800,
    },
    benefits: [
      'Alto contenido proteico',
      'Ingredientes naturales',
      'Sin conservantes artificiales',
      'Mejora digestión',
    ],
    usage_instructions: 'Servir 2-3 tazas al día según peso...',
    
    // SEO
    meta_title: 'Alimento Premium para Perros Adultos - Mascoty',
    meta_description: 'Compra alimento premium natural...',
    
    // Status
    is_active: true,
    is_featured: true,
    is_subscription: true,
  },
});
```

### **Filtrar Productos por Especie y Edad:**
```typescript
const puppyFood = await prisma.product.findMany({
  where: {
    species: {
      has: 'DOG',
    },
    age_group: {
      has: 'PUPPY_KITTEN',
    },
    is_active: true,
  },
  include: {
    category: true,
    brand: true,
  },
});
```

### **Productos Destacados:**
```typescript
const featured = await prisma.product.findMany({
  where: {
    is_featured: true,
    is_active: true,
    stock: { gt: 0 },
  },
  orderBy: {
    rating_avg: 'desc',
  },
  take: 8,
});
```

### **Productos Más Vendidos:**
```typescript
const bestSellers = await prisma.product.findMany({
  where: {
    is_active: true,
  },
  orderBy: {
    sales_count: 'desc',
  },
  take: 10,
});
```

### **Alerta de Stock Bajo:**
```typescript
const lowStock = await prisma.product.findMany({
  where: {
    stock: {
      lte: prisma.product.fields.low_stock_alert,
    },
    is_active: true,
  },
  select: {
    id: true,
    name: true,
    sku: true,
    stock: true,
    low_stock_alert: true,
  },
});
```

### **Actualizar Analytics:**
```typescript
// Incrementar vistas
await prisma.product.update({
  where: { id: productId },
  data: {
    views_count: { increment: 1 },
  },
});

// Actualizar rating después de review
const reviews = await prisma.review.aggregate({
  where: { product_id: productId },
  _avg: { rating: true },
  _count: true,
});

await prisma.product.update({
  where: { id: productId },
  data: {
    rating_avg: reviews._avg.rating || 0,
    review_count: reviews._count,
  },
});

// Incrementar ventas
await prisma.product.update({
  where: { id: productId },
  data: {
    sales_count: { increment: quantity },
    stock: { decrement: quantity },
  },
});
```

### **Buscar por Marca:**
```typescript
const brandProducts = await prisma.product.findMany({
  where: {
    brand_id: brandId,
    is_active: true,
  },
  include: {
    brand: true,
    category: true,
  },
});
```

### **Filtrar por Tamaño de Mascota:**
```typescript
const productsForLargeDogs = await prisma.product.findMany({
  where: {
    species: { has: 'DOG' },
    size_suitable: { has: 'LARGE' },
    is_active: true,
  },
});
```

### **Productos con Suscripción:**
```typescript
const subscriptionProducts = await prisma.product.findMany({
  where: {
    is_subscription: true,
    is_active: true,
    stock: { gt: 0 },
  },
});
```

---

## 🎯 Features del Nuevo Modelo

### **E-commerce Avanzado:**
- ✅ Múltiples imágenes (Cloudinary)
- ✅ Precio tachado (compare_price)
- ✅ Cálculo de márgenes (cost)
- ✅ Alertas de stock
- ✅ SKU único
- ✅ Marcas de productos

### **Pet-Specific:**
- ✅ Especies compatibles (array)
- ✅ Grupos de edad (array)
- ✅ Tamaños adecuados (array)
- ✅ Info nutricional estructurada
- ✅ Ingredientes detallados
- ✅ Beneficios del producto

### **Analytics & SEO:**
- ✅ Vistas del producto
- ✅ Contador de ventas
- ✅ Rating promedio
- ✅ Contador de reseñas
- ✅ Meta tags completos

### **Gestión Avanzada:**
- ✅ Productos destacados
- ✅ Productos suscripción
- ✅ Soft delete
- ✅ Timestamps automáticos
- ✅ 11 índices optimizados

---

## 📊 Queries Optimizados

### **Dashboard Admin:**
```typescript
// Productos que necesitan atención
const dashboard = await prisma.$transaction([
  // Stock bajo
  prisma.product.count({
    where: {
      stock: { lte: 10 },
      is_active: true,
    },
  }),
  
  // Más vendidos esta semana
  prisma.product.findMany({
    where: {
      is_active: true,
    },
    orderBy: { sales_count: 'desc' },
    take: 5,
  }),
  
  // Mejor valorados
  prisma.product.findMany({
    where: {
      is_active: true,
      review_count: { gte: 5 },
    },
    orderBy: { rating_avg: 'desc' },
    take: 5,
  }),
]);
```

### **Catálogo con Filtros:**
```typescript
const products = await prisma.product.findMany({
  where: {
    is_active: true,
    category_id: categoryId,
    species: species ? { has: species } : undefined,
    age_group: ageGroup ? { has: ageGroup } : undefined,
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
    brand_id: brandId || undefined,
  },
  include: {
    category: true,
    brand: true,
  },
  orderBy: sortBy === 'price' 
    ? { price: order }
    : sortBy === 'rating'
    ? { rating_avg: 'desc' }
    : { sales_count: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
});
```

---

## 🔄 Migración de Datos

Si tienes productos existentes:

```typescript
// Script de migración
const products = await prisma.product.findMany();

for (const product of products) {
  await prisma.product.update({
    where: { id: product.id },
    data: {
      // Renombrar campos
      compare_price: product.original_price,
      short_description: product.short_desc,
      meta_description: product.meta_desc,
      
      // Nuevos campos con defaults
      low_stock_alert: 10,
      species: [],
      age_group: [],
      size_suitable: [],
      benefits: [],
      views_count: 0,
      sales_count: 0,
      rating_avg: 0,
      review_count: 0,
      is_active: true,
      is_featured: false,
      is_subscription: false,
    },
  });
}
```

---

## ✅ Checklist de Actualización

### **Nuevo Modelo:**
- [x] ✅ Brand model creado
- [x] ✅ Enums AgeGroup y PetSize

### **Campos Renombrados:**
- [x] ✅ short_desc → short_description
- [x] ✅ original_price → compare_price
- [x] ✅ meta_desc → meta_description

### **Campos Nuevos:**
- [x] ✅ low_stock_alert
- [x] ✅ brand_id / brand relation
- [x] ✅ species (array)
- [x] ✅ age_group (array)
- [x] ✅ size_suitable (array)
- [x] ✅ dimensions (Json)
- [x] ✅ ingredients
- [x] ✅ nutritional_info (Json)
- [x] ✅ benefits (array)
- [x] ✅ usage_instructions
- [x] ✅ views_count
- [x] ✅ sales_count
- [x] ✅ rating_avg
- [x] ✅ review_count
- [x] ✅ is_active
- [x] ✅ is_featured
- [x] ✅ is_subscription

### **Índices:**
- [x] ✅ 11 índices optimizados
- [x] ✅ Todos los FKs indexados

---

## 🚀 Aplicar Cambios

```bash
# 1. Generar cliente
npm run prisma:generate

# 2. Push a BD
npm run prisma:push

# 3. Verificar
npm run prisma:studio
```

---

## 📚 Documentación

- **`PRODUCT_MODEL_UPDATED.md`** - Esta guía
- **`PRISMA_SCHEMA.md`** - Schema completo
- **`DATABASE_OPTIMIZATIONS.md`** - Optimizaciones

---

**🛍️ Modelo Product completo para e-commerce de mascotas!** 🚀
