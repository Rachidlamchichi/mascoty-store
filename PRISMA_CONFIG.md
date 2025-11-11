# 🔧 Configuración de Prisma

## ✅ Configuración Actual

### **`prisma/schema.prisma`**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// MODELOS DE BASE DE DATOS
// Se definirán en PARTE 2: SCHEMA DE BASE DE DATOS
// ============================================
```

---

## 📋 Variables de Entorno Requeridas

### **`.env` y `.env.local`**

Ambas deben tener:

```bash
# Database URLs for Prisma
DATABASE_URL="postgresql://postgres:618004026@db.yjlqykfhjjubneiradfg.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:618004026@db.yjlqykfhjjubneiradfg.supabase.co:5432/postgres"
```

✅ **Ya configuradas** en tu proyecto

---

## 🔄 Diferencia entre DATABASE_URL y DIRECT_URL

### **`DATABASE_URL`**
- 🔌 Conexión con pooling/proxy
- ⚡ Optimizada para Serverless y Edge Functions
- 🌐 Ideal para producción con alto tráfico

### **`DIRECT_URL`**
- 🎯 Conexión directa a la base de datos
- 🛠️ Necesaria para migraciones de Prisma
- 📊 Requerida para comandos como `prisma migrate` y `prisma db push`

En Supabase, ambas apuntan a la misma base de datos, pero es buena práctica tener ambas configuradas.

---

## 🎯 Estrategia de Desarrollo

### **Opción 1: Solo Supabase (Recomendado para este proyecto)**
✅ Usas el SQL directo en Supabase
✅ Prisma solo para queries
✅ No usas migraciones de Prisma
✅ Schema se gestiona en Supabase

**Ventajas:**
- 🚀 Aprovechas todas las features de Supabase (Auth, Storage, Realtime)
- 🔒 RLS policies nativas de Postgres
- 📊 SQL directo más potente
- ⚡ Más simple para este proyecto

**Workflow:**
1. Creas/modificas tablas en Supabase SQL Editor
2. Sincronizas schema con Prisma: `npx prisma db pull`
3. Generas cliente: `npx prisma generate`
4. Usas Prisma Client para queries type-safe

### **Opción 2: Prisma como ORM principal**
❌ No recomendado para este proyecto porque:
- Prisma no soporta RLS de Postgres nativamente
- Perderías features de Supabase Auth
- Más complejo de mantener

---

## 🚀 Comandos Útiles de Prisma

### **Sincronizar schema desde la base de datos:**
```bash
npx prisma db pull
```
Este comando:
- 📥 Lee tu base de datos de Supabase
- 📝 Genera los modelos en `schema.prisma`
- ✅ Mantiene tu schema sincronizado

### **Generar Prisma Client:**
```bash
npx prisma generate
```
Genera el cliente TypeScript con tipos automáticos.

### **Abrir Prisma Studio (GUI para ver datos):**
```bash
npx prisma studio
```
Abre una interfaz web en http://localhost:5555 para ver y editar datos.

### **Validar schema:**
```bash
npx prisma validate
```
Verifica que tu schema.prisma sea válido.

### **Formatear schema:**
```bash
npx prisma format
```
Formatea el archivo schema.prisma.

---

## 📝 Próximos Pasos (PARTE 2)

### **1. Ejecutar SQL en Supabase** (si aún no lo hiciste)
```
✅ Abre: https://app.supabase.com/project/yjlqykfhjjubneiradfg/sql/new
✅ Ejecuta: supabase-schema.sql
✅ Verifica que las 7 tablas se crearon
```

### **2. Sincronizar Prisma con la base de datos**
```bash
npx prisma db pull
```

Esto generará automáticamente los modelos en `prisma/schema.prisma`:
- ✅ Profile
- ✅ Product
- ✅ Category
- ✅ Pet
- ✅ Order
- ✅ OrderItem
- ✅ Subscription

### **3. Generar Prisma Client**
```bash
npx prisma generate
```

### **4. Usar Prisma en tu código**

**Crear cliente de Prisma:**

**`src/lib/prisma/client.ts`**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Ejemplo de uso:**
```typescript
import { prisma } from '@/lib/prisma/client';

// Fetch products
const products = await prisma.product.findMany({
  where: { featured: true },
  include: { category: true }
});

// Create order
const order = await prisma.order.create({
  data: {
    userId: user.id,
    total: 100.00,
    status: 'pending',
    shippingAddress: { /* ... */ },
    paymentMethod: 'card',
    orderItems: {
      create: [
        { productId: '...', quantity: 2, price: 50.00 }
      ]
    }
  }
});
```

---

## 🎯 Integración con Supabase

### **¿Puedo usar Prisma Y Supabase juntos?**

**¡Sí!** Y es una excelente combinación:

**Usa Supabase para:**
- 🔐 Autenticación (Auth)
- 📁 Storage (archivos/imágenes)
- 📡 Realtime (WebSockets)
- 🔒 Row Level Security (RLS)
- 📊 Schema management (SQL directo)

**Usa Prisma para:**
- 🔍 Queries type-safe
- 📝 Modelado de datos
- 🤝 Relaciones complejas
- ✅ Validaciones
- 🎯 Autocompletado en IDE

**Ejemplo combinado:**
```typescript
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

// Usa Supabase para auth
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return { error: 'Not authenticated' };
}

// Usa Prisma para queries complejas
const userOrders = await prisma.order.findMany({
  where: { userId: user.id },
  include: {
    orderItems: {
      include: { product: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

---

## ⚙️ Configuración Actual

| Configuración | Estado | Valor |
|---------------|--------|-------|
| **Provider** | ✅ Configurado | PostgreSQL |
| **DATABASE_URL** | ✅ Configurado | Supabase Postgres |
| **DIRECT_URL** | ✅ Configurado | Supabase Postgres (directo) |
| **Generator** | ✅ Configurado | prisma-client-js |
| **Modelos** | ⏳ Pendiente | Se generarán con `prisma db pull` |

---

## 🔄 Workflow Recomendado

```mermaid
graph LR
    A[Crear tabla en Supabase SQL] --> B[npx prisma db pull]
    B --> C[npx prisma generate]
    C --> D[Usar Prisma Client en código]
    D --> E[Queries type-safe]
```

1. **Crear/modificar schema en Supabase** (usando SQL)
2. **Sincronizar con Prisma:** `npx prisma db pull`
3. **Generar cliente:** `npx prisma generate`
4. **Desarrollar:** Usar Prisma Client con autocompletado
5. **Repetir** cuando cambies el schema

---

## 📚 Recursos

- **Prisma Docs:** https://www.prisma.io/docs
- **Prisma + Supabase:** https://www.prisma.io/docs/guides/database/supabase
- **Prisma Client API:** https://www.prisma.io/docs/reference/api-reference/prisma-client-reference

---

## ✅ Estado Actual

- [x] ✅ Prisma instalado
- [x] ✅ Schema configurado con datasource y generator
- [x] ✅ Variables de entorno configuradas
- [ ] ⏳ SQL ejecutado en Supabase (pendiente)
- [ ] ⏳ Modelos sincronizados con `prisma db pull`
- [ ] ⏳ Cliente generado con `prisma generate`
- [ ] ⏳ Cliente de Prisma creado en `src/lib/prisma/client.ts`

---

**🎯 Siguiente paso:** Ejecutar `supabase-schema.sql` en Supabase, luego sincronizar con Prisma usando `npx prisma db pull`

