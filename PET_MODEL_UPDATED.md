# 🐾 Modelo Pet Actualizado

## 🎯 Cambios Implementados

Se ha actualizado el modelo Pet con campos mejorados y más específicos para gestión de mascotas.

---

## 📝 Cambios Principales

### **1. Enum Renombrado**
```prisma
// ANTES
enum PetType {
  DOG, CAT, BIRD, FISH, RABBIT, HAMSTER, OTHER
}

// DESPUÉS
enum PetSpecies {
  DOG, CAT, BIRD, FISH, REPTILE, RODENT, RABBIT, OTHER
}
```

**Nuevas especies:**
- ✅ **REPTILE** (lagartijas, serpientes, tortugas)
- ✅ **RODENT** (ratones, hamsters, cobayas)

### **2. Campos Eliminados**
- ❌ `size` (PetSize) - Redundante, se puede calcular con peso
- ❌ `image_url` - Renombrado a `photo_url`
- ❌ `medical_notes` - Reemplazado por `conditions` (más estructurado)

### **3. Campos Nuevos**

#### **conditions (String[])**
```typescript
// Array de condiciones médicas específicas
conditions: ['diabetes', 'artritis', 'alergias cutáneas']
```

**Ventajas:**
- ✅ Más estructurado que `medical_notes`
- ✅ Filtrable y buscable
- ✅ Permite estadísticas

#### **diet_type (String?)**
```typescript
// Tipo de dieta recomendada
diet_type: 'veterinaria'  // o 'natural', 'premium'
```

**Valores:**
- `'natural'` - Comida natural/casera
- `'veterinaria'` - Dieta prescrita por veterinario
- `'premium'` - Alimento premium/especializado
- `null` - No especificado

#### **is_active (Boolean)**
```typescript
// Estado de la mascota
is_active: true  // Mascota activa
is_active: false // Mascota inactiva/fallecida
```

**Ventajas:**
- ✅ Soft delete adicional
- ✅ No eliminar datos históricos
- ✅ Filtrar solo mascotas activas

### **4. Campos Renombrados**

| Antes | Después | Motivo |
|-------|---------|--------|
| `type` | `species` | Más preciso biológicamente |
| `image_url` | `photo_url` | Más descriptivo para mascotas |

---

## 🔍 Modelo Completo Actualizado

```prisma
model Pet {
  id            String      @id @default(uuid())
  user_id       String
  user          User        @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  // Basic Info
  name          String
  species       PetSpecies
  breed         String?
  birth_date    DateTime?
  weight        Float?      // en kg
  
  // Health & Preferences
  allergies     String[]    // array de alergenos
  conditions    String[]    // condiciones médicas
  diet_type     String?     // "natural", "veterinaria", "premium"
  
  photo_url     String?
  is_active     Boolean     @default(true)
  
  // Relations
  subscriptions Subscription[]
  
  // Timestamps
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt
  deleted_at    DateTime?   // Soft delete
  
  // Performance indexes
  @@index([user_id])
  @@index([species])
  @@index([is_active])
  @@index([created_at])
  
  @@map("pets")
}

enum PetSpecies {
  DOG
  CAT
  BIRD
  FISH
  REPTILE
  RODENT
  RABBIT
  OTHER
}
```

---

## 💡 Ejemplos de Uso

### **Crear Mascota:**
```typescript
const pet = await prisma.pet.create({
  data: {
    user_id: userId,
    name: 'Max',
    species: 'DOG',
    breed: 'Golden Retriever',
    birth_date: new Date('2020-05-15'),
    weight: 32.5,
    allergies: ['pollo', 'gluten'],
    conditions: ['displasia de cadera'],
    diet_type: 'veterinaria',
    photo_url: 'https://...',
    is_active: true,
  },
});
```

### **Actualizar Condiciones Médicas:**
```typescript
await prisma.pet.update({
  where: { id: petId },
  data: {
    conditions: {
      push: 'artritis', // Agregar nueva condición
    },
  },
});
```

### **Cambiar Dieta:**
```typescript
await prisma.pet.update({
  where: { id: petId },
  data: {
    diet_type: 'premium',
  },
});
```

### **Marcar como Inactiva:**
```typescript
// Cuando una mascota fallece o ya no está con el usuario
await prisma.pet.update({
  where: { id: petId },
  data: {
    is_active: false,
  },
});
```

### **Listar Solo Mascotas Activas:**
```typescript
const activePets = await prisma.pet.findMany({
  where: {
    user_id: userId,
    is_active: true,
    deleted_at: null,
  },
  orderBy: {
    created_at: 'desc',
  },
});
```

### **Buscar por Especie:**
```typescript
const dogs = await prisma.pet.findMany({
  where: {
    species: 'DOG',
    is_active: true,
  },
  include: {
    user: true,
  },
});
```

### **Buscar por Condición Médica:**
```typescript
const petsWithDiabetes = await prisma.pet.findMany({
  where: {
    conditions: {
      has: 'diabetes',
    },
    is_active: true,
  },
});
```

### **Estadísticas por Especie:**
```typescript
const stats = await prisma.pet.groupBy({
  by: ['species'],
  where: {
    is_active: true,
  },
  _count: true,
});

// Resultado:
// [
//   { species: 'DOG', _count: 150 },
//   { species: 'CAT', _count: 120 },
//   { species: 'BIRD', _count: 30 },
// ]
```

---

## 🎯 Ventajas del Modelo Actualizado

### **1. Más Específico:**
- ✅ `species` más preciso que `type`
- ✅ `conditions[]` estructurado vs `medical_notes` texto libre
- ✅ `diet_type` categorizado

### **2. Mejor Performance:**
- ✅ Índice en `species` para filtrar
- ✅ Índice en `is_active` para queries comunes
- ✅ Arrays (`conditions`, `allergies`) más rápidos que JSON

### **3. Más Funcional:**
- ✅ `is_active` para soft delete adicional
- ✅ `conditions` para estadísticas de salud
- ✅ `diet_type` para recomendaciones de productos

### **4. Mejor UX:**
- ✅ `photo_url` más claro que `image_url`
- ✅ `conditions` estructuradas facilitan UI
- ✅ `diet_type` ayuda a filtrar productos

---

## 📊 Queries Comunes Optimizadas

### **Dashboard de Usuario:**
```typescript
const userPets = await prisma.pet.findMany({
  where: {
    user_id: userId,
    is_active: true, // Solo activas
  },
  select: {
    id: true,
    name: true,
    species: true,
    photo_url: true,
    weight: true,
  },
});
```

### **Recomendación de Productos:**
```typescript
// Productos según dieta de la mascota
const pet = await prisma.pet.findUnique({
  where: { id: petId },
});

const recommendedProducts = await prisma.product.findMany({
  where: {
    tags: {
      has: pet.diet_type || 'premium',
    },
    category: {
      slug: `${pet.species.toLowerCase()}-alimentos`,
    },
  },
});
```

### **Alertas de Salud:**
```typescript
// Mascotas con condiciones que requieren atención
const petsWithConditions = await prisma.pet.findMany({
  where: {
    user_id: userId,
    is_active: true,
    conditions: {
      isEmpty: false, // Tiene condiciones
    },
  },
  select: {
    name: true,
    conditions: true,
    diet_type: true,
  },
});
```

---

## 🔄 Migración de Datos

Si ya tienes datos con el modelo antiguo:

```typescript
// Script de migración
const pets = await prisma.pet.findMany();

for (const pet of pets) {
  await prisma.pet.update({
    where: { id: pet.id },
    data: {
      species: pet.type, // Migrar type → species
      photo_url: pet.image_url, // Migrar image_url → photo_url
      is_active: true, // Default
      conditions: [], // Inicializar vacío
      // medical_notes puede quedar en un campo temporal si existe
    },
  });
}
```

---

## ✅ Checklist de Actualización

- [x] ✅ Enum `PetType` → `PetSpecies`
- [x] ✅ Agregadas especies: `REPTILE`, `RODENT`
- [x] ✅ Campo `type` → `species`
- [x] ✅ Campo `image_url` → `photo_url`
- [x] ✅ Agregado `conditions[]`
- [x] ✅ Agregado `diet_type`
- [x] ✅ Agregado `is_active`
- [x] ✅ Eliminado `size` (PetSize enum)
- [x] ✅ Eliminado `medical_notes`
- [x] ✅ Índices actualizados
- [x] ✅ Documentación completa

---

## 🚀 Aplicar Cambios

```bash
# 1. Generar cliente actualizado
npm run prisma:generate

# 2. Push a base de datos
npm run prisma:push

# 3. Verificar en Prisma Studio
npm run prisma:studio
```

---

## 📚 Archivos Actualizados

- ✅ `prisma/schema.prisma` - Modelo actualizado
- ✅ `PET_MODEL_UPDATED.md` - Esta documentación

---

**🐾 Modelo Pet actualizado y listo para usar!** 🚀
