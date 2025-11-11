# 🔐 Supabase Client Setup - Actualizado

## ✅ Archivos Actualizados

Se han actualizado los clientes de Supabase para usar `@supabase/auth-helpers-nextjs` con tipado completo.

---

## 📁 Archivos Creados

### **1. Client Component Client**
```typescript
// src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export const createClient = () => createClientComponentClient<Database>()
```

**Uso:**
- Para Client Components
- Hooks de autenticación
- Interacciones del navegador

### **2. Server Component Client**
```typescript
// src/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
```

**Uso:**
- Para Server Components
- API Routes
- Server Actions

---

## 💡 Ejemplos de Uso

### **Client Component:**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
      
      setProducts(data || [])
    }
    
    loadProducts()
  }, [])
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### **Server Component:**
```typescript
import { createServerClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = createServerClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### **API Route:**
```typescript
// app/api/products/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

### **Server Action:**
```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/products')
  return data
}
```

### **Autenticación (Client):**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()
  
  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    console.log('Logged in:', data.user)
  }
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### **Obtener Usuario (Server):**
```typescript
import { createServerClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Not logged in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {user.email}</h1>
    </div>
  )
}
```

---

## 🔧 Configuración Necesaria

### **1. Instalar Dependencias:**
```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

### **2. Variables de Entorno:**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **3. Generar Tipos (Opcional pero Recomendado):**
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

O si ya tienes el Supabase CLI configurado:
```bash
supabase gen types typescript --local > src/types/database.types.ts
```

---

## 🎯 Diferencias entre Client y Server

| Característica | Client | Server |
|----------------|--------|--------|
| **Ubicación** | Navegador | Servidor |
| **Cookies** | Automáticas | Necesita `cookies()` |
| **Auth** | Session del navegador | Session del servidor |
| **RLS** | Basado en usuario | Basado en usuario |
| **Uso** | Interacciones UI | Fetching inicial, API |

---

## ⚠️ Importante

### **Client Components:**
- Requieren `'use client'` directive
- Session se sincroniza automáticamente
- Ideal para formularios y acciones del usuario

### **Server Components:**
- NO requieren `'use client'`
- Session se lee de las cookies
- Ideal para fetching inicial de datos

### **Middleware (Opcional):**
Si necesitas proteger rutas, crea:
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Proteger rutas
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## 🔄 Actualizar desde @supabase/ssr

Si tenías la versión anterior con `@supabase/ssr`, estos son los cambios:

### **Antes:**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### **Después:**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export const createClient = () => createClientComponentClient<Database>()
```

**Ventajas:**
- ✅ Tipado completo automático
- ✅ Mejor integración con Next.js
- ✅ Manejo automático de cookies
- ✅ No necesitas pasar las variables de entorno

---

## 📚 Recursos

- [Supabase Auth Helpers Docs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [TypeScript Types](https://supabase.com/docs/guides/api/generating-types)

---

## ✅ Checklist

- [x] ✅ Cliente para Client Components creado
- [x] ✅ Cliente para Server Components creado
- [x] ✅ Tipos importados desde database.types.ts
- [x] ✅ Ejemplos de uso documentados
- [ ] 🔜 Instalar @supabase/auth-helpers-nextjs
- [ ] 🔜 Configurar variables de entorno
- [ ] 🔜 Generar tipos de Supabase (opcional)

---

**🔐 Clientes de Supabase configurados con tipado completo!** 🚀
