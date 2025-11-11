# 🗄️ Supabase Setup Guide

## ✅ Archivos Creados

### 1. **Cliente de Supabase para Browser** 
`src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```
✅ **Uso:** En componentes cliente (`'use client'`)

---

### 2. **Cliente de Supabase para Server**
`src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```
✅ **Uso:** En Server Components y API Routes

---

### 3. **Tipos de Base de Datos**
`src/types/database.types.ts`

✅ **Estructura de tablas creada:**
- `profiles` - Perfiles de usuarios
- `products` - Productos de la tienda
- `categories` - Categorías de productos
- `pets` - Mascotas de los usuarios
- `orders` - Pedidos
- `order_items` - Items de pedidos
- `subscriptions` - Suscripciones

✅ **Enums definidos:**
- `order_status`: pending, processing, shipped, delivered, cancelled
- `subscription_status`: active, cancelled, expired
- `pet_species`: dog, cat, bird, other

---

## 🔄 Sincronizar Tipos con Supabase (cuando sea necesario)

### Opción 1: Login con Supabase CLI
```bash
# 1. Login en Supabase
npx supabase login

# 2. Generar tipos
npx supabase gen types typescript --project-id yjlqykfhjjubneiradfg > src/types/database.types.ts
```

### Opción 2: Usar Access Token
```bash
# 1. Obtener token desde: https://app.supabase.com/account/tokens
# 2. Establecer variable de entorno
$env:SUPABASE_ACCESS_TOKEN="tu_token_aqui"

# 3. Generar tipos
npx supabase gen types typescript --project-id yjlqykfhjjubneiradfg > src/types/database.types.ts
```

### Opción 3: Desde Supabase Dashboard
1. Ve a: https://app.supabase.com/project/yjlqykfhjjubneiradfg/api
2. Copia los tipos TypeScript generados automáticamente
3. Reemplaza el contenido de `src/types/database.types.ts`

---

## 📝 Crear Tablas en Supabase

### SQL para crear las tablas base:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  weight DECIMAL(5, 2),
  image TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

-- Pets policies (private)
CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE USING (auth.uid() = user_id);

-- Orders policies (private)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 Cómo Usar los Clientes

### En Componentes Cliente:
```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

export default function ClientComponent() {
  const supabase = createClient();
  
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    return data;
  };
}
```

### En Server Components:
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*');
  
  return <div>{/* render products */}</div>;
}
```

### En API Routes:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

---

## 🔐 Configuración de Autenticación

### Habilitar Email Auth en Supabase:
1. Ve a: https://app.supabase.com/project/yjlqykfhjjubneiradfg/auth/providers
2. Habilita **Email** provider
3. Configura URLs de redirección:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://tu-dominio.com/auth/callback`

---

## 📊 Estado Actual

| Componente | Estado |
|------------|--------|
| Cliente Browser | ✅ Configurado |
| Cliente Server | ✅ Configurado |
| Tipos Base de Datos | ✅ Creados |
| Tablas Supabase | ⚠️ Pendiente de crear |
| RLS Policies | ⚠️ Pendiente de crear |

---

## 🚀 Próximos Pasos

1. ✅ Ejecutar el SQL en Supabase SQL Editor
2. ✅ Verificar que las tablas se crearon correctamente
3. ✅ Probar la conexión desde Next.js
4. ✅ Implementar autenticación
5. ✅ Crear funciones CRUD para cada tabla

---

**Conexión Actual:**
- **Project ID:** yjlqykfhjjubneiradfg
- **Database:** PostgreSQL en Supabase
- **Region:** Configurado automáticamente

