# 🔄 Modelo Subscription Actualizado - Sistema de Suscripciones

## 🎯 Cambios Implementados

Se ha actualizado el modelo Subscription con un sistema simplificado y enfocado en suscripciones de productos con Stripe.

---

## 📝 Cambios Principales

### **1. Campos Removidos:**

| Campo Removido | Motivo |
|----------------|--------|
| `pet_id` / `pet` | No es necesario, suscripción es de usuario |
| `price` | Se calcula desde product.price |
| `start_date` | Redundante (usar created_at) |
| `paused_until` | Simplificado a paused_at |
| `deleted_at` | Soft delete removido |

### **2. Campos Renombrados:**

| Antes | Después | Motivo |
|-------|---------|--------|
| `frequency` | `frequency_days` | Más específico |
| `next_delivery_date` | `next_delivery` | Más corto |

### **3. Campos Nuevos:**

#### **last_delivery (DateTime?)**
```prisma
last_delivery  DateTime?
```

**Uso:**
- Registrar última entrega realizada
- Calcular próxima entrega
- Historial de entregas

#### **paused_at (DateTime?)**
```prisma
// ANTES
paused_until  DateTime?  // Hasta cuándo está pausada

// DESPUÉS
paused_at  DateTime?  // Cuándo se pausó
```

**Ventaja:** Más simple, solo registra cuándo se pausó

### **4. SubscriptionStatus Simplificado:**

```prisma
// ANTES
enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
  EXPIRED  ❌
}

// DESPUÉS
enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
}
```

**Cambio:** Removido `EXPIRED` (se maneja con cancelled_at)

### **5. discount_percent con Default:**
```prisma
discount_percent  Float  @default(10)  // 10% descuento por defecto
```

### **6. Índices Simplificados:**

```prisma
// ANTES
@@index([user_id])
@@index([pet_id])        ❌
@@index([product_id])    ❌
@@index([status])
@@index([next_delivery_date])  ❌
@@index([created_at])    ❌

// DESPUÉS
@@index([user_id])
@@index([status])
```

---

## 📋 Modelo Completo

```prisma
model Subscription {
  id                String    @id @default(uuid())
  
  user_id           String
  user              User
  
  product_id        String
  product           Product
  
  quantity          Int       @default(1)
  frequency_days    Int       // 14, 28, 42, 56
  discount_percent  Float     @default(10)
  
  // Stripe Subscription
  stripe_subscription_id String? @unique
  
  // Status
  status            SubscriptionStatus @default(ACTIVE)
  
  next_delivery     DateTime
  last_delivery     DateTime?
  
  paused_at         DateTime?
  cancelled_at      DateTime?
  
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt
  
  @@index([user_id])
  @@index([status])
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
}
```

---

## 💡 Ejemplos de Uso

### **Crear Suscripción:**
```typescript
export async function createSubscription(
  userId: string,
  productId: string,
  frequencyDays: number = 28
) {
  // 1. Obtener producto
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId, is_subscription: true },
    select: { price: true, name: true },
  });
  
  // 2. Crear en Stripe
  const priceWithDiscount = product.price * 0.9; // 10% descuento
  
  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{
      price_data: {
        currency: 'eur',
        product_data: { name: product.name },
        recurring: { interval_count: frequencyDays, interval: 'day' },
        unit_amount: Math.round(priceWithDiscount * 100),
      },
    }],
    metadata: {
      user_id: userId,
      product_id: productId,
    },
  });
  
  // 3. Crear suscripción en BD
  const subscription = await prisma.subscription.create({
    data: {
      user_id: userId,
      product_id: productId,
      quantity: 1,
      frequency_days: frequencyDays,
      discount_percent: 10,
      stripe_subscription_id: stripeSubscription.id,
      status: 'ACTIVE',
      next_delivery: calculateNextDelivery(frequencyDays),
    },
  });
  
  return subscription;
}

function calculateNextDelivery(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
```

### **Listar Suscripciones del Usuario:**
```typescript
export async function getUserSubscriptions(userId: string) {
  return await prisma.subscription.findMany({
    where: {
      user_id: userId,
      status: { in: ['ACTIVE', 'PAUSED'] },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          thumbnail: true,
          slug: true,
        },
      },
    },
    orderBy: {
      next_delivery: 'asc',
    },
  });
}
```

### **Pausar Suscripción:**
```typescript
export async function pauseSubscription(subscriptionId: string) {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });
  
  // Pausar en Stripe
  if (subscription.stripe_subscription_id) {
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { pause_collection: { behavior: 'void' } }
    );
  }
  
  // Pausar en BD
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: 'PAUSED',
      paused_at: new Date(),
    },
  });
}
```

### **Reanudar Suscripción:**
```typescript
export async function resumeSubscription(subscriptionId: string) {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });
  
  // Reanudar en Stripe
  if (subscription.stripe_subscription_id) {
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { pause_collection: null }
    );
  }
  
  // Reanudar en BD
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: 'ACTIVE',
      paused_at: null,
      next_delivery: calculateNextDelivery(subscription.frequency_days),
    },
  });
}
```

### **Cancelar Suscripción:**
```typescript
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });
  
  // Cancelar en Stripe
  if (subscription.stripe_subscription_id) {
    await stripe.subscriptions.cancel(
      subscription.stripe_subscription_id
    );
  }
  
  // Cancelar en BD
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: 'CANCELLED',
      cancelled_at: new Date(),
    },
  });
}
```

### **Procesar Entrega (Cron Job):**
```typescript
export async function processDeliveries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Buscar suscripciones que deben entregarse hoy
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      next_delivery: {
        lte: today,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          addresses: {
            where: { is_default: true },
            take: 1,
          },
        },
      },
      product: true,
    },
  });
  
  for (const subscription of subscriptions) {
    try {
      // Crear orden automática
      await createSubscriptionOrder(subscription);
      
      // Actualizar próxima entrega
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          last_delivery: new Date(),
          next_delivery: calculateNextDelivery(
            subscription.frequency_days
          ),
        },
      });
      
      console.log(`✅ Entrega procesada: ${subscription.id}`);
    } catch (error) {
      console.error(`❌ Error procesando ${subscription.id}:`, error);
    }
  }
}

async function createSubscriptionOrder(subscription: any) {
  const address = subscription.user.addresses[0];
  const priceWithDiscount = 
    subscription.product.price * 
    (1 - subscription.discount_percent / 100);
  
  return await prisma.order.create({
    data: {
      order_number: generateOrderNumber(),
      user_id: subscription.user_id,
      
      subtotal: priceWithDiscount * subscription.quantity,
      shipping_cost: 0, // Gratis para suscripciones
      tax: 0,
      discount: subscription.product.price * subscription.quantity * 
                (subscription.discount_percent / 100),
      total: priceWithDiscount * subscription.quantity,
      
      shipping_address: {
        name: subscription.user.name || 'Cliente',
        street: address.street,
        city: address.city,
        zip: address.postal_code,
        country: address.country,
      },
      
      status: 'PROCESSING',
      payment_status: 'PAID', // Ya pagado por suscripción
      
      customer_notes: 'Orden automática de suscripción',
      
      items: {
        create: [{
          product_id: subscription.product_id,
          product_name: subscription.product.name,
          quantity: subscription.quantity,
          price: priceWithDiscount,
        }],
      },
    },
  });
}
```

### **Cambiar Frecuencia:**
```typescript
export async function changeFrequency(
  subscriptionId: string,
  newFrequencyDays: number
) {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });
  
  // Actualizar en Stripe (si es necesario recrear)
  if (subscription.stripe_subscription_id) {
    // Stripe no permite cambiar interval fácilmente
    // Opción: cancelar y crear nueva
  }
  
  // Actualizar en BD
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      frequency_days: newFrequencyDays,
      next_delivery: calculateNextDelivery(newFrequencyDays),
    },
  });
}
```

### **Cambiar Cantidad:**
```typescript
export async function changeQuantity(
  subscriptionId: string,
  newQuantity: number
) {
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { quantity: newQuantity },
  });
}
```

---

## 🎯 Frecuencias Comunes

```typescript
const FREQUENCIES = {
  BIWEEKLY: 14,   // Cada 2 semanas
  MONTHLY: 28,    // Cada 4 semanas
  SIX_WEEKS: 42,  // Cada 6 semanas
  TWO_MONTHS: 56, // Cada 8 semanas
};
```

---

## 🎨 UI Components

### **Subscription Card:**
```tsx
interface SubscriptionCardProps {
  subscription: {
    id: string;
    quantity: number;
    frequency_days: number;
    discount_percent: number;
    status: SubscriptionStatus;
    next_delivery: Date;
    last_delivery?: Date;
    product: {
      name: string;
      price: number;
      thumbnail: string;
    };
  };
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const priceWithDiscount = 
    subscription.product.price * 
    (1 - subscription.discount_percent / 100);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={subscription.product.thumbnail}
          alt={subscription.product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{subscription.product.name}</h3>
          <p className="text-sm text-muted-foreground">
            Cantidad: {subscription.quantity}
          </p>
          <p className="text-sm text-muted-foreground">
            Cada {subscription.frequency_days} días
          </p>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Precio original:</span>
            <span className="text-sm line-through text-muted-foreground">
              €{subscription.product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Con descuento:</span>
            <span className="text-sm font-semibold text-green-600">
              €{priceWithDiscount.toFixed(2)}
              <Badge variant="success" className="ml-2 text-xs">
                -{subscription.discount_percent}%
              </Badge>
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm">Próxima entrega:</span>
            <span className="font-semibold">
              {formatDate(subscription.next_delivery)}
            </span>
          </div>
          {subscription.last_delivery && (
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Última entrega:</span>
              <span>{formatDate(subscription.last_delivery)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {subscription.status === 'ACTIVE' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pauseSubscription(subscription.id)}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditModal(subscription)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </>
        )}
        
        {subscription.status === 'PAUSED' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => resumeSubscription(subscription.id)}
          >
            <Play className="h-4 w-4 mr-2" />
            Reanudar
            </Button>
        )}
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => cancelSubscription(subscription.id)}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### **Frequency Selector:**
```tsx
export function FrequencySelector({ value, onChange }: Props) {
  const options = [
    { days: 14, label: 'Cada 2 semanas' },
    { days: 28, label: 'Cada 4 semanas (mensual)' },
    { days: 42, label: 'Cada 6 semanas' },
    { days: 56, label: 'Cada 2 meses' },
  ];
  
  return (
    <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.days} value={opt.days.toString()}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 🔄 API Routes

### **POST /api/subscriptions - Crear:**
```typescript
export async function POST(request: Request) {
  const session = await getSession();
  const { product_id, frequency_days, quantity } = await request.json();
  
  const subscription = await createSubscription(
    session.user.id,
    product_id,
    frequency_days
  );
  
  return Response.json(subscription);
}
```

### **PATCH /api/subscriptions/:id/pause - Pausar:**
```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await pauseSubscription(params.id);
  return Response.json({ success: true });
}
```

### **PATCH /api/subscriptions/:id/resume - Reanudar:**
```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await resumeSubscription(params.id);
  return Response.json({ success: true });
}
```

### **DELETE /api/subscriptions/:id - Cancelar:**
```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await cancelSubscription(params.id);
  return Response.json({ success: true });
}
```

---

## ✅ Checklist de Actualización

### **Campos:**
- [x] ❌ `pet_id` removido
- [x] ❌ `price` removido
- [x] ❌ `start_date` removido
- [x] ❌ `deleted_at` removido
- [x] ✅ `frequency` → `frequency_days`
- [x] ✅ `next_delivery_date` → `next_delivery`
- [x] ✅ `paused_until` → `paused_at`
- [x] ✅ `last_delivery` agregado
- [x] ✅ `discount_percent` default 10

### **Enum:**
- [x] ❌ `EXPIRED` removido

### **Índices:**
- [x] ✅ Simplificados (solo 2)

### **Relaciones:**
- [x] ❌ Relación con Pet removida

---

## 🚀 Aplicar Cambios

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

---

**🔄 Sistema de suscripciones simplificado y optimizado con Stripe!** 🚀
