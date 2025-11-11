# 🚀 Cómo Ejecutar el Schema de Supabase

## ✅ Paso a Paso (5 minutos)

### **Paso 1: Abrir SQL Editor de Supabase**

🔗 **Link directo:** https://app.supabase.com/project/tbijzzdjjruegjlyebmk/sql/new

O manualmente:
1. Ve a https://app.supabase.com
2. Click en tu proyecto "Mascoty" (ID: tbijzzdjjruegjlyebmk)
3. En el menú lateral, click en **"SQL Editor"**
4. Click en **"New query"**

---

### **Paso 2: Copiar el SQL**

1. Abre el archivo: `supabase-schema.sql` (en la raíz del proyecto)
2. Selecciona TODO el contenido (Ctrl+A)
3. Copia (Ctrl+C)

**O** usa este comando en PowerShell:
```powershell
Get-Content supabase-schema.sql | Set-Clipboard
```

---

### **Paso 3: Pegar y Ejecutar**

1. En el SQL Editor de Supabase, pega el código (Ctrl+V)
2. Click en el botón **"RUN"** (o presiona Ctrl+Enter)
3. Espera unos segundos...

---

### **Paso 4: Verificar Resultado**

✅ **Si todo salió bien, verás:**
```
✅ Schema created successfully!
📊 Tables: profiles, products, categories, pets, orders, order_items, subscriptions
🔒 RLS policies enabled
🎯 5 sample categories inserted
```

❌ **Si hay error:**
- Lee el mensaje de error
- Verifica que no existan las tablas previamente
- Si necesitas resetear, descomenta las líneas DROP al inicio del SQL

---

### **Paso 5: Verificar las Tablas**

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver estas 7 tablas:
   - ✅ profiles
   - ✅ products
   - ✅ categories (con 5 categorías de ejemplo)
   - ✅ pets
   - ✅ orders
   - ✅ order_items
   - ✅ subscriptions

---

## 🔍 Verificación Rápida

### **Ver Categorías Creadas:**
```sql
SELECT * FROM categories;
```

Deberías ver:
- Alimento
- Juguetes
- Accesorios
- Higiene
- Salud

### **Verificar RLS Policies:**
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🎯 Siguiente Paso: Probar la Conexión

### **Opción 1: Desde el navegador**

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Crea un componente de prueba (ejemplo):

**`src/app/test/page.tsx`**
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    return <div>❌ Error: {error.message}</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">✅ Conexión exitosa!</h1>
      <h2 className="text-xl mb-2">Categorías:</h2>
      <ul>
        {categories?.map(cat => (
          <li key={cat.id}>📦 {cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

3. Visita: http://localhost:3000/test

---

### **Opción 2: Desde API Route**

**`src/app/api/test/route.ts`**
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: '✅ Conexión exitosa con Supabase',
    categories: data
  });
}
```

Visita: http://localhost:3000/api/test

---

## 🔐 Configurar Autenticación (Opcional pero Recomendado)

### **Habilitar Email Auth:**

1. Ve a: https://app.supabase.com/project/tbijzzdjjruegjlyebmk/auth/providers
2. Encuentra **"Email"** en la lista
3. Actívalo si no lo está
4. En **"Site URL"**, configura:
   - Development: `http://localhost:3000`
   - Production: tu dominio cuando despliegues

5. En **"Redirect URLs"**, añade:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**` (para wildcards)

---

## 📝 Insertar Productos de Ejemplo (Opcional)

### **Ejecuta este SQL para agregar productos de prueba:**

```sql
INSERT INTO products (name, description, price, category, stock, featured, images) VALUES
  (
    'Royal Canin Adult 15kg',
    'Alimento completo para perros adultos. Fórmula balanceada.',
    45.99,
    'Alimento',
    50,
    true,
    ARRAY['https://via.placeholder.com/400']
  ),
  (
    'Pelota Kong Classic',
    'Juguete resistente de caucho natural. Ideal para perros activos.',
    12.99,
    'Juguetes',
    100,
    true,
    ARRAY['https://via.placeholder.com/400']
  ),
  (
    'Collar Ajustable Premium',
    'Collar de nylon resistente con hebilla de seguridad.',
    8.99,
    'Accesorios',
    75,
    false,
    ARRAY['https://via.placeholder.com/400']
  ),
  (
    'Shampoo Hipoalergénico',
    'Shampoo suave para pieles sensibles. PH balanceado.',
    15.50,
    'Higiene',
    60,
    false,
    ARRAY['https://via.placeholder.com/400']
  ),
  (
    'Multivitamínico Canino',
    'Suplemento vitamínico completo. 60 tabletas masticables.',
    24.99,
    'Salud',
    40,
    true,
    ARRAY['https://via.placeholder.com/400']
  );
```

---

## ✅ Checklist Final

- [ ] SQL ejecutado sin errores
- [ ] 7 tablas creadas
- [ ] 5 categorías insertadas
- [ ] RLS policies activas
- [ ] Conexión probada desde Next.js
- [ ] (Opcional) Email auth habilitado
- [ ] (Opcional) Productos de ejemplo insertados

---

## 🆘 Solución de Problemas

### **Error: "relation already exists"**
Las tablas ya existen. Opciones:
1. Úsalas tal como están
2. O descomenta las líneas DROP al inicio del SQL para resetear

### **Error: "permission denied"**
Tu usuario no tiene permisos. Verifica:
- Que estés usando el proyecto correcto
- Que tengas permisos de administrador

### **Error de conexión desde Next.js**
Verifica `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yjlqykfhjjubneiradfg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### **RLS bloqueando consultas**
Si no puedes leer datos:
1. Las policies de products/categories permiten lectura pública
2. Para profiles/pets/orders necesitas estar autenticado
3. Temporalmente puedes deshabilitar RLS para testing (no recomendado en producción)

---

## 🎉 ¡Listo!

Una vez completado, tu base de datos estará:
- ✅ Completamente configurada
- ✅ Con seguridad RLS activada
- ✅ Lista para desarrollo
- ✅ Con datos de ejemplo

**Próximo paso:** Empezar a construir las páginas y componentes de la aplicación! 🚀

