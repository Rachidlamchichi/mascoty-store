# 📂 Modelo Category Actualizado

## 🎯 Cambios Implementados

Se ha actualizado el modelo Category con campos de ordenamiento y control de estado.

---

## 📝 Cambios Principales

### **1. Campos Renombrados**

| Antes | Después |
|-------|---------|
| `image_url` | `image` |

### **2. Campos Removidos**

- ❌ `deleted_at` - Soft delete removido
- ❌ Índice en `name` - Simplificación

### **3. Campos Nuevos**

#### **order (Int)**
```prisma
order  Int  @default(0)
```

**Uso:**
- Ordenamiento manual de categorías
- Control de posición en el menú
- Útil para categorías destacadas

**Ejemplo:**
```typescript
// Categorías ordenadas
const categories = await prisma.category.findMany({
  where: { is_active: true },
  orderBy: { order: 'asc' },
});
```

#### **is_active (Boolean)**
```prisma
is_active  Boolean  @default(true)
```

**Uso:**
- Activar/desactivar categorías sin eliminar
- Ocultar temporalmente
- Control de visibilidad

**Ejemplo:**
```typescript
// Solo categorías activas
const activeCategories = await prisma.category.findMany({
  where: { is_active: true },
});

// Desactivar categoría
await prisma.category.update({
  where: { id: categoryId },
  data: { is_active: false },
});
```

### **4. Restricciones Removidas**

**Antes:**
```prisma
name  String  @unique
```

**Después:**
```prisma
name  String
```

**Motivo:**
- Permite nombres duplicados en diferentes jerarquías
- Ejemplo: "Alimentos" puede existir bajo "Perros" y "Gatos"
- Más flexible para categorías anidadas

---

## 📋 Modelo Completo

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  icon        String?
  image       String?
  
  parent_id   String?
  parent      Category? @relation("CategoryHierarchy", fields: [parent_id], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  
  products    Product[]
  
  order       Int       @default(0)
  is_active   Boolean   @default(true)
  
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  @@index([parent_id])
  @@index([slug])
  @@map("categories")
}
```

---

## 💡 Ejemplos de Uso

### **Crear Categoría con Orden:**
```typescript
const category = await prisma.category.create({
  data: {
    name: 'Perros',
    slug: 'perros',
    description: 'Productos para perros',
    icon: '🐕',
    image: 'https://res.cloudinary.com/.../perros.jpg',
    order: 1,  // Primera categoría
    is_active: true,
  },
});
```

### **Crear Subcategoría:**
```typescript
const subcategory = await prisma.category.create({
  data: {
    name: 'Alimentos',
    slug: 'perros-alimentos',
    description: 'Alimentos para perros',
    parent_id: perrosCategoryId,
    order: 1,
    is_active: true,
  },
});
```

### **Listar Categorías Activas Ordenadas:**
```typescript
const categories = await prisma.category.findMany({
  where: {
    is_active: true,
    parent_id: null,  // Solo categorías principales
  },
  orderBy: {
    order: 'asc',
  },
  include: {
    children: {
      where: { is_active: true },
      orderBy: { order: 'asc' },
    },
  },
});
```

### **Reordenar Categorías:**
```typescript
// Cambiar orden de múltiples categorías
await prisma.$transaction([
  prisma.category.update({
    where: { id: 'cat1' },
    data: { order: 1 },
  }),
  prisma.category.update({
    where: { id: 'cat2' },
    data: { order: 2 },
  }),
  prisma.category.update({
    where: { id: 'cat3' },
    data: { order: 3 },
  }),
]);
```

### **Activar/Desactivar:**
```typescript
// Desactivar categoría y sus hijos
await prisma.category.update({
  where: { id: categoryId },
  data: {
    is_active: false,
    children: {
      updateMany: {
        where: {},
        data: { is_active: false },
      },
    },
  },
});

// Reactivar
await prisma.category.update({
  where: { id: categoryId },
  data: { is_active: true },
});
```

### **Menú Jerárquico:**
```typescript
// Construir menú con categorías y subcategorías
const menu = await prisma.category.findMany({
  where: {
    parent_id: null,
    is_active: true,
  },
  orderBy: { order: 'asc' },
  include: {
    children: {
      where: { is_active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    },
    _count: {
      select: { products: true },
    },
  },
});

// Resultado:
// [
//   {
//     id: 'xxx',
//     name: 'Perros',
//     slug: 'perros',
//     order: 1,
//     _count: { products: 45 },
//     children: [
//       {
//         name: 'Alimentos',
//         slug: 'perros-alimentos',
//         order: 1,
//         _count: { products: 25 },
//       },
//       {
//         name: 'Accesorios',
//         order: 2,
//         _count: { products: 20 },
//       },
//     ],
//   },
// ]
```

### **Buscar Categorías por Nombre:**
```typescript
// Ahora se puede tener "Alimentos" duplicado
const foodCategories = await prisma.category.findMany({
  where: {
    name: 'Alimentos',
    is_active: true,
  },
  include: {
    parent: true,  // Incluir categoría padre para diferenciar
  },
});

// Resultado:
// [
//   { name: 'Alimentos', parent: { name: 'Perros' } },
//   { name: 'Alimentos', parent: { name: 'Gatos' } },
// ]
```

---

## 🎯 Ventajas del Nuevo Modelo

### **1. Ordenamiento Manual:**
```typescript
// Control total del orden en el menú
order: 1  // Perros
order: 2  // Gatos
order: 3  // Aves
order: 99 // Otros (al final)
```

### **2. Activación/Desactivación:**
```typescript
// Sin eliminar datos
is_active: false  // Ocultar temporalmente
is_active: true   // Mostrar nuevamente
```

### **3. Nombres Flexibles:**
```typescript
// Permitir duplicados en diferentes contextos
Perros > Alimentos
Gatos > Alimentos
Aves > Alimentos
```

### **4. Gestión Simplificada:**
```typescript
// Sin soft delete, más simple
// Sin índice en name, más rápido
// Con order, más control
```

---

## 📊 Casos de Uso Comunes

### **Dashboard Admin - Reordenar:**
```typescript
// UI drag & drop para cambiar orden
async function reorderCategories(categories: { id: string; order: number }[]) {
  await prisma.$transaction(
    categories.map(cat =>
      prisma.category.update({
        where: { id: cat.id },
        data: { order: cat.order },
      })
    )
  );
}
```

### **Frontend - Menú Principal:**
```typescript
// Next.js page
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { is_active: true, parent_id: null },
    orderBy: { order: 'asc' },
    select: { slug: true },
  });
  
  return categories.map(cat => ({ slug: cat.slug }));
}
```

### **API Route - Listar Categorías:**
```typescript
// /api/categories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get('parent_id');
  
  const categories = await prisma.category.findMany({
    where: {
      is_active: true,
      parent_id: parentId || null,
    },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  
  return Response.json(categories);
}
```

---

## 🔄 Migración de Datos

Si tienes categorías existentes:

```typescript
// Script de migración
const categories = await prisma.category.findMany();

for (const [index, category] of categories.entries()) {
  await prisma.category.update({
    where: { id: category.id },
    data: {
      // Renombrar campo
      image: category.image_url,
      
      // Asignar orden basado en posición actual
      order: index + 1,
      
      // Activar todas por defecto
      is_active: true,
    },
  });
}
```

---

## 🎨 UI Components

### **Category Card:**
```tsx
interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    icon: string;
    image: string;
    order: number;
    _count: { products: number };
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categoria/${category.slug}`}>
      <Card>
        <div className="relative">
          {category.image && (
            <img src={category.image} alt={category.name} />
          )}
          <div className="text-4xl">{category.icon}</div>
        </div>
        <CardContent>
          <h3>{category.name}</h3>
          <p>{category._count.products} productos</p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### **Category Menu:**
```tsx
export function CategoryMenu({ categories }) {
  return (
    <nav>
      {categories.map(category => (
        <div key={category.id}>
          <Link href={`/categoria/${category.slug}`}>
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Link>
          
          {category.children?.length > 0 && (
            <ul>
              {category.children.map(child => (
                <li key={child.id}>
                  <Link href={`/categoria/${child.slug}`}>
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

## ✅ Checklist de Actualización

### **Campos:**
- [x] ✅ `image_url` → `image`
- [x] ✅ `name` sin @unique
- [x] ✅ `order` agregado
- [x] ✅ `is_active` agregado
- [x] ❌ `deleted_at` removido

### **Índices:**
- [x] ✅ `parent_id` indexado
- [x] ✅ `slug` indexado
- [x] ❌ `name` índice removido

### **Funcionalidad:**
- [x] ✅ Ordenamiento manual
- [x] ✅ Activación/desactivación
- [x] ✅ Nombres duplicados permitidos
- [x] ✅ Jerarquía mantenida

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

## 📚 Archivos Relacionados

- `CATEGORY_MODEL_UPDATED.md` - Esta guía
- `SCHEMA_FINAL_RESUMEN.md` - Schema completo
- `PRISMA_SCHEMA.md` - Documentación general

---

**📂 Modelo Category optimizado con orden y control de estado!** 🚀
