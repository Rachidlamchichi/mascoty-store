# 🛡️ Middleware de Autenticación - Supabase

## ✅ Middleware Creado

Se ha creado el middleware de Supabase para proteger rutas que requieren autenticación.

---

## 📁 Archivo Creado

```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Rutas protegidas
  const protectedRoutes = ['/cuenta', '/checkout', '/mis-mascotas']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/cuenta/:path*', '/checkout/:path*', '/mis-mascotas/:path*']
}
```

---

## 🎯 Rutas Protegidas

El middleware protege estas rutas automáticamente:

| Ruta | Descripción | Redirige a |
|------|-------------|------------|
| `/cuenta/*` | Perfil y configuración del usuario | `/login` |
| `/checkout/*` | Proceso de compra | `/login` |
| `/mis-mascotas/*` | Gestión de mascotas | `/login` |

---

## 🔧 Cómo Funciona

### **1. Verificación de Sesión:**
```typescript
const {
  data: { session },
} = await supabase.auth.getSession()
```

- Lee la sesión desde las cookies
- Verifica si el usuario está autenticado

### **2. Protección de Rutas:**
```typescript
const protectedRoutes = ['/cuenta', '/checkout', '/mis-mascotas']
const isProtectedRoute = protectedRoutes.some(route => 
  req.nextUrl.pathname.startsWith(route)
)
```

- Lista de rutas que requieren autenticación
- Usa `startsWith()` para incluir subrutas

### **3. Redirección:**
```typescript
if (isProtectedRoute && !session) {
  return NextResponse.redirect(new URL('/login', req.url))
}
```

- Si no hay sesión y es ruta protegida, redirige a login

### **4. Matcher:**
```typescript
export const config = {
  matcher: ['/cuenta/:path*', '/checkout/:path*', '/mis-mascotas/:path*']
}
```

- Define qué rutas ejecutan el middleware
- Evita ejecutar en todas las rutas (mejor performance)

---

## 🚀 Agregar Más Rutas Protegidas

### **Opción 1: Agregar al Array**
```typescript
const protectedRoutes = [
  '/cuenta',
  '/checkout',
  '/mis-mascotas',
  '/suscripciones',  // Nueva
  '/pedidos',        // Nueva
  '/favoritos',      // Nueva
]
```

### **Opción 2: Actualizar Matcher**
```typescript
export const config = {
  matcher: [
    '/cuenta/:path*',
    '/checkout/:path*',
    '/mis-mascotas/:path*',
    '/suscripciones/:path*',  // Nueva
    '/pedidos/:path*',         // Nueva
    '/favoritos/:path*',       // Nueva
  ]
}
```

---

## 💡 Casos de Uso Avanzados

### **Proteger Admin Routes:**
```typescript
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Verificar si es admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', session.user.id)
      .single()
    
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  // Rutas protegidas normales
  const protectedRoutes = ['/cuenta', '/checkout', '/mis-mascotas']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}
```

### **Guardar URL de Retorno:**
```typescript
if (isProtectedRoute && !session) {
  const redirectUrl = new URL('/login', req.url)
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}
```

Luego en el login:
```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/cuenta'
  
  async function handleLogin(email: string, password: string) {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error) {
      router.push(redirect) // Redirigir a donde intentaba ir
    }
  }
  
  // ...
}
```

### **Excluir Rutas Específicas:**
```typescript
// Excluir /checkout/success (puede ser pública)
if (req.nextUrl.pathname === '/checkout/success') {
  return res
}

// Continuar con protección normal
if (isProtectedRoute && !session) {
  return NextResponse.redirect(new URL('/login', req.url))
}
```

### **Diferentes Redirecciones por Ruta:**
```typescript
if (!session) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  
  if (req.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login?from=checkout', req.url))
  }
  
  return NextResponse.redirect(new URL('/login', req.url))
}
```

---

## 🎨 Flujo de Usuario

```
Usuario intenta acceder a /cuenta
        ↓
Middleware verifica sesión
        ↓
   ¿Tiene sesión?
    /          \
  Sí           No
   ↓            ↓
Permite      Redirige
acceso       a /login
   ↓            ↓
/cuenta      /login
```

---

## 🔒 Seguridad

### **Doble Verificación:**
El middleware NO reemplaza la verificación en el servidor. Siempre verifica en:

**1. Middleware (primera capa):**
- Previene acceso no autorizado
- Mejora UX con redirección inmediata

**2. Server Component/API (segunda capa):**
```typescript
// app/cuenta/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CuentaPage() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Continuar con lógica...
}
```

**3. API Routes:**
```typescript
// app/api/orders/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Continuar...
}
```

---

## 📊 Performance

### **Matcher Optimization:**
```typescript
// ❌ Malo - Ejecuta en TODAS las rutas
export const config = {
  matcher: '/:path*'
}

// ✅ Bueno - Solo en rutas protegidas
export const config = {
  matcher: ['/cuenta/:path*', '/checkout/:path*']
}
```

### **Early Return:**
```typescript
// ✅ Retornar temprano si no es ruta protegida
const isProtectedRoute = protectedRoutes.some(route => 
  req.nextUrl.pathname.startsWith(route)
)

if (!isProtectedRoute) {
  return res // No ejecutar lógica innecesaria
}

// Continuar solo si es protegida
const { data: { session } } = await supabase.auth.getSession()
```

---

## 🧪 Testing

### **Rutas Protegidas:**
```typescript
// Test: Sin sesión debe redirigir
fetch('/cuenta')
  .then(res => {
    console.log(res.url) // Debe ser /login
  })

// Test: Con sesión debe permitir
// (Después de login)
fetch('/cuenta')
  .then(res => {
    console.log(res.url) // Debe ser /cuenta
  })
```

---

## ⚠️ Importante

1. **No olvides instalar:**
```bash
npm install @supabase/auth-helpers-nextjs
```

2. **El middleware se ejecuta en el Edge Runtime:**
- Muy rápido
- Cerca del usuario
- Limitaciones de Node.js APIs

3. **Cookies son Httponly:**
- Más seguras
- No accesibles desde JavaScript del cliente
- Manejadas automáticamente por Supabase

---

## 📚 Documentación Relacionada

- **`SUPABASE_CLIENT_SETUP.md`** - Setup de clientes
- **`src/lib/supabase/client.ts`** - Client component client
- **`src/lib/supabase/server.ts`** - Server component client

---

## ✅ Checklist

- [x] ✅ Middleware creado en `src/middleware.ts`
- [x] ✅ Rutas protegidas definidas
- [x] ✅ Matcher configurado
- [x] ✅ Redirección a `/login`
- [ ] 🔜 Instalar @supabase/auth-helpers-nextjs
- [ ] 🔜 Crear página `/login`
- [ ] 🔜 Probar flujo completo

---

## 🎯 Próximos Pasos

1. **Crear página de Login:**
```typescript
// app/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="container max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-8">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  )
}
```

2. **Crear componente LoginForm:**
```typescript
// components/auth/LoginForm.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    
    router.push('/cuenta')
    router.refresh()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
```

3. **Probar el flujo:**
- Ir a `/cuenta` sin login → debe redirigir a `/login`
- Login exitoso → debe redirigir a `/cuenta`
- Rutas no protegidas → accesibles sin login

---

**🛡️ Middleware de autenticación configurado y listo!** 🚀
