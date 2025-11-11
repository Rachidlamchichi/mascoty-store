# ⭐ Modelo Review Actualizado - Sistema Completo de Reseñas

## 🎯 Cambios Implementados

Se ha actualizado el modelo Review con un sistema completo de reseñas incluyendo verificación de compra, fotos, visibilidad y contador de utilidad.

---

## 📝 Cambios Principales

### **1. Campos Renombrados:**

| Antes | Después | Motivo |
|-------|---------|--------|
| `verified` | `is_verified` | Más descriptivo |

### **2. Campos Nuevos:**

#### **order_id (String?)**
```prisma
order_id  String?  // para verificar compra
```

**Uso:**
- Verificar que el usuario compró el producto
- Marcar reseñas como "Compra verificada"
- Más credibilidad

**Ejemplo:**
```typescript
// Solo permitir review si compró
const order = await prisma.orderItem.findFirst({
  where: {
    order: { user_id: userId },
    product_id: productId,
  },
});

if (!order) {
  throw new Error('Debes comprar el producto para reseñar');
}
```

#### **photos (String[])**
```prisma
photos  String[]  // URLs de fotos subidas
```

**Uso:**
- Usuarios pueden subir fotos del producto
- Cloudinary para almacenar imágenes
- Más confianza en las reseñas

**Ejemplo:**
```typescript
photos: [
  'https://res.cloudinary.com/.../review-photo-1.jpg',
  'https://res.cloudinary.com/.../review-photo-2.jpg',
]
```

#### **is_visible (Boolean)**
```prisma
is_visible  Boolean  @default(true)
```

**Uso:**
- Ocultar reseñas inapropiadas sin eliminar
- Moderación de contenido
- Admin puede mostrar/ocultar

**Ejemplo:**
```typescript
// Ocultar reseña
await prisma.review.update({
  where: { id: reviewId },
  data: { is_visible: false },
});
```

#### **helpful_count (Int)**
```prisma
helpful_count  Int  @default(0)
```

**Uso:**
- Contador de "¿Te fue útil?"
- Ordenar reseñas por utilidad
- Mostrar reseñas más útiles primero

**Ejemplo:**
```typescript
// Incrementar contador
await prisma.review.update({
  where: { id: reviewId },
  data: {
    helpful_count: { increment: 1 },
  },
});
```

### **3. Campos Actualizados:**

```prisma
comment  String  @db.Text  // Ahora obligatorio
```

**Cambio:** Antes era opcional (`String?`), ahora es requerido

### **4. Campos Removidos:**

- ❌ `deleted_at` - Soft delete removido
- ❌ Índices en `rating` y `verified` - Simplificación
- ❌ Índice en `created_at` - Simplificación

---

## 📋 Modelo Completo

```prisma
model Review {
  id          String    @id @default(uuid())
  
  user_id     String
  user        User      @relation(...)
  
  product_id  String
  product     Product   @relation(...)
  
  order_id    String?   // verificar compra
  
  rating      Int       // 1-5
  title       String?
  comment     String    @db.Text
  photos      String[]  // fotos subidas
  
  is_verified Boolean   @default(false)
  is_visible  Boolean   @default(true)
  
  helpful_count Int     @default(0)
  
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  @@unique([user_id, product_id])
  @@index([product_id])
  @@index([user_id])
}
```

---

## 💡 Ejemplos de Uso

### **Crear Reseña con Verificación:**
```typescript
// 1. Verificar que compró el producto
const order = await prisma.orderItem.findFirst({
  where: {
    order: { 
      user_id: userId,
      status: 'DELIVERED', // Solo pedidos entregados
    },
    product_id: productId,
  },
  select: {
    order_id: true,
  },
});

if (!order) {
  throw new Error('Debes comprar el producto primero');
}

// 2. Crear reseña verificada
const review = await prisma.review.create({
  data: {
    user_id: userId,
    product_id: productId,
    order_id: order.order_id,
    rating: 5,
    title: 'Excelente producto',
    comment: 'Mi perro lo adora, muy buena calidad...',
    photos: [
      'https://res.cloudinary.com/.../photo1.jpg',
      'https://res.cloudinary.com/.../photo2.jpg',
    ],
    is_verified: true, // Porque tiene order_id
    is_visible: true,
  },
});

// 3. Actualizar rating del producto
await updateProductRating(productId);
```

### **Listar Reseñas con Filtros:**
```typescript
const reviews = await prisma.review.findMany({
  where: {
    product_id: productId,
    is_visible: true, // Solo visibles
  },
  include: {
    user: {
      select: {
        name: true,
        avatar_url: true,
      },
    },
  },
  orderBy: [
    { is_verified: 'desc' },    // Verificadas primero
    { helpful_count: 'desc' },  // Más útiles primero
    { created_at: 'desc' },     // Más recientes
  ],
});
```

### **Marcar como Útil:**
```typescript
// Endpoint: POST /api/reviews/:id/helpful
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.review.update({
    where: { id: params.id },
    data: {
      helpful_count: { increment: 1 },
    },
  });
  
  return Response.json({ success: true });
}
```

### **Moderar Reseña:**
```typescript
// Admin oculta reseña inapropiada
await prisma.review.update({
  where: { id: reviewId },
  data: { is_visible: false },
});

// Admin aprueba reseña
await prisma.review.update({
  where: { id: reviewId },
  data: { is_visible: true },
});
```

### **Actualizar Rating del Producto:**
```typescript
async function updateProductRating(productId: string) {
  const stats = await prisma.review.aggregate({
    where: {
      product_id: productId,
      is_visible: true, // Solo contar visibles
    },
    _avg: { rating: true },
    _count: true,
  });
  
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating_avg: stats._avg.rating || 0,
      review_count: stats._count,
    },
  });
}
```

### **Reseñas Más Útiles:**
```typescript
const topReviews = await prisma.review.findMany({
  where: {
    product_id: productId,
    is_visible: true,
    helpful_count: { gte: 5 }, // Al menos 5 votos
  },
  orderBy: {
    helpful_count: 'desc',
  },
  take: 3,
  include: {
    user: {
      select: { name: true, avatar_url: true },
    },
  },
});
```

### **Estadísticas de Reseñas:**
```typescript
// Distribución de ratings
const distribution = await prisma.$queryRaw`
  SELECT 
    rating,
    COUNT(*) as count
  FROM reviews
  WHERE product_id = ${productId}
    AND is_visible = true
  GROUP BY rating
  ORDER BY rating DESC
`;

// Resultado:
// [
//   { rating: 5, count: 120 },
//   { rating: 4, count: 45 },
//   { rating: 3, count: 10 },
//   { rating: 2, count: 3 },
//   { rating: 1, count: 2 },
// ]
```

---

## 🎯 Features del Nuevo Modelo

### **Verificación de Compra:**
- ✅ Campo `order_id` para verificar
- ✅ Badge "Compra verificada"
- ✅ Más credibilidad

### **Fotos de Usuarios:**
- ✅ Array de URLs (Cloudinary)
- ✅ Múltiples fotos por reseña
- ✅ Mayor confianza

### **Sistema de Utilidad:**
- ✅ Contador `helpful_count`
- ✅ Ordenar por más útiles
- ✅ Destacar mejores reseñas

### **Moderación:**
- ✅ `is_visible` para ocultar
- ✅ Sin eliminar datos
- ✅ Control de contenido

---

## 🎨 UI Components

### **Review Card:**
```tsx
interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string;
    comment: string;
    photos: string[];
    is_verified: boolean;
    helpful_count: number;
    created_at: Date;
    user: {
      name: string;
      avatar_url?: string;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [wasHelpful, setWasHelpful] = useState(false);
  
  const handleHelpful = async () => {
    await fetch(`/api/reviews/${review.id}/helpful`, {
      method: 'POST',
    });
    setWasHelpful(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user.avatar_url} />
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{review.user.name}</p>
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} />
              {review.is_verified && (
                <Badge variant="success" className="text-xs">
                  ✓ Compra verificada
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {review.title && (
          <h4 className="font-semibold mb-2">{review.title}</h4>
        )}
        <p className="text-muted-foreground mb-4">{review.comment}</p>
        
        {/* Fotos */}
        {review.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {review.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Review photo ${i + 1}`}
                className="rounded-lg object-cover aspect-square cursor-pointer"
                onClick={() => openLightbox(photo)}
              />
            ))}
          </div>
        )}
        
        {/* Útil */}
        <div className="flex items-center gap-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={wasHelpful}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Útil ({review.helpful_count})
          </Button>
          <span className="text-muted-foreground">
            {formatDate(review.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **Review Form:**
```tsx
export function ReviewForm({ productId, orderId }: Props) {
  const [photos, setPhotos] = useState<File[]>([]);
  
  const onSubmit = async (data: FormData) => {
    // 1. Subir fotos a Cloudinary
    const photoUrls = await uploadPhotos(photos);
    
    // 2. Crear reseña
    await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        order_id: orderId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: photoUrls,
      }),
    });
  };
  
  return (
    <Form onSubmit={onSubmit}>
      {/* Rating stars */}
      <StarRating name="rating" required />
      
      {/* Title */}
      <Input name="title" placeholder="Título (opcional)" />
      
      {/* Comment */}
      <Textarea 
        name="comment" 
        placeholder="Cuéntanos tu experiencia..."
        required
      />
      
      {/* Photos */}
      <PhotoUpload
        maxFiles={5}
        onSelect={setPhotos}
      />
      
      <Button type="submit">Publicar Reseña</Button>
    </Form>
  );
}
```

### **Rating Distribution:**
```tsx
export function RatingDistribution({ productId }: Props) {
  const distribution = useRatingDistribution(productId);
  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => {
        const data = distribution.find(d => d.rating === rating);
        const count = data?.count || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span>{rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1">
              <Progress value={percentage} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 🔄 API Routes

### **POST /api/reviews - Crear Reseña:**
```typescript
export async function POST(request: Request) {
  const session = await getSession();
  const data = await request.json();
  
  // Verificar que compró el producto
  const order = await prisma.orderItem.findFirst({
    where: {
      order: { 
        user_id: session.user.id,
        status: 'DELIVERED',
      },
      product_id: data.product_id,
    },
  });
  
  // Crear reseña
  const review = await prisma.review.create({
    data: {
      user_id: session.user.id,
      product_id: data.product_id,
      order_id: order?.order_id,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      photos: data.photos || [],
      is_verified: !!order,
      is_visible: true,
    },
  });
  
  // Actualizar rating del producto
  await updateProductRating(data.product_id);
  
  return Response.json(review);
}
```

### **POST /api/reviews/:id/helpful - Marcar Útil:**
```typescript
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.review.update({
    where: { id: params.id },
    data: {
      helpful_count: { increment: 1 },
    },
  });
  
  return Response.json({ success: true });
}
```

### **PATCH /api/reviews/:id/visibility - Moderar:**
```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { is_visible } = await request.json();
  
  await prisma.review.update({
    where: { id: params.id },
    data: { is_visible },
  });
  
  return Response.json({ success: true });
}
```

---

## ✅ Checklist de Actualización

### **Campos:**
- [x] ✅ `verified` → `is_verified`
- [x] ✅ `order_id` agregado
- [x] ✅ `photos` agregado
- [x] ✅ `is_visible` agregado
- [x] ✅ `helpful_count` agregado
- [x] ✅ `comment` ahora obligatorio
- [x] ❌ `deleted_at` removido

### **Índices:**
- [x] ✅ `product_id` indexado
- [x] ✅ `user_id` indexado
- [x] ✅ Unique `[user_id, product_id]`
- [x] ❌ Índices extra removidos

### **Funcionalidad:**
- [x] ✅ Verificación de compra
- [x] ✅ Subir fotos
- [x] ✅ Sistema de utilidad
- [x] ✅ Moderación con visibilidad

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

**⭐ Modelo Review completo con verificación, fotos y sistema de utilidad!** 🚀
