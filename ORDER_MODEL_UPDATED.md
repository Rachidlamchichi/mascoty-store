# 📦 Modelo Order Actualizado - Sistema Completo de Pedidos

## 🎯 Cambios Implementados

Se ha actualizado completamente el modelo Order con un sistema profesional de gestión de pedidos incluyendo estados de pago, dirección embebida y snapshots de productos.

---

## 📝 Cambios Principales

### **1. Nuevo Enum: PaymentStatus**
```prisma
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

**Uso:**
- Gestión independiente del estado de pago
- No confundir con estado del pedido
- Control de pagos fallidos

### **2. OrderStatus Actualizado:**
```prisma
// ANTES
enum OrderStatus {
  PENDING
  CONFIRMED   ❌
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

// DESPUÉS
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

**Cambio:** Removido `CONFIRMED` (redundante con PAID)

### **3. Campos de Order Actualizados:**

#### **Formato de order_number:**
```prisma
order_number  String  @unique  // formato: MSC-20250110-001
```

**Ejemplo:** `MSC-20250110-001` (Mascoty + Fecha + Contador)

#### **shipping_address (Json)**
```prisma
shipping_address  Json  // {name, street, city, zip, phone}
```

**ANTES:** Relación con Address table  
**DESPUÉS:** Json embebido (snapshot)

**Ventajas:**
- ✅ Dirección no cambia si usuario la edita
- ✅ Historial completo
- ✅ Más rápido (sin JOIN)

#### **payment_status (PaymentStatus)**
```prisma
payment_status  PaymentStatus  @default(PENDING)
```

**Estados independientes:**
- Order status: PROCESSING
- Payment status: PAID

#### **stripe_payment_id**
```prisma
// ANTES
payment_intent_id  String?

// DESPUÉS
stripe_payment_id  String?  @unique
```

#### **Notas separadas:**
```prisma
customer_notes  String?       // Notas del cliente
admin_notes     String?  @db.Text  // Notas del admin
```

#### **cancelled_at agregado:**
```prisma
shipped_at      DateTime?
delivered_at    DateTime?
cancelled_at    DateTime?  // ✅ Nuevo
```

### **4. Campos Removidos:**
- ❌ `address_id` - Ahora usa shipping_address (Json)
- ❌ `paid_at` - Reemplazado por payment_status
- ❌ `deleted_at` - Soft delete removido

### **5. Índices Simplificados:**
```prisma
// ANTES
@@index([order_number])
@@index([user_id])
@@index([address_id])  ❌
@@index([status])
@@index([created_at])  ❌
@@index([paid_at])     ❌
@@index([delivered_at]) ❌

// DESPUÉS
@@index([user_id])
@@index([status])
@@index([order_number])
```

---

## 📋 Modelo Order Completo

```prisma
model Order {
  id              String      @id @default(uuid())
  order_number    String      @unique // MSC-20250110-001
  
  user_id         String
  user            User
  
  // Pricing
  subtotal        Float
  shipping_cost   Float
  discount        Float       @default(0)
  tax             Float       @default(0)
  total           Float
  
  // Shipping
  shipping_address Json       // snapshot
  tracking_number  String?
  
  // Status
  status          OrderStatus @default(PENDING)
  payment_status  PaymentStatus @default(PENDING)
  
  // Payment
  stripe_payment_id String?   @unique
  payment_method    String?
  
  // Notes
  customer_notes  String?
  admin_notes     String?     @db.Text
  
  // Relations
  items           OrderItem[]
  
  shipped_at      DateTime?
  delivered_at    DateTime?
  cancelled_at    DateTime?
  
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  
  @@index([user_id])
  @@index([status])
  @@index([order_number])
}
```

---

## 📋 Modelo OrderItem Completo

```prisma
model OrderItem {
  id          String    @id @default(uuid())
  
  order_id    String
  order       Order
  
  product_id  String
  product     Product
  
  product_name String   // snapshot
  quantity    Int
  price       Float     // snapshot
  
  created_at  DateTime  @default(now())
  
  @@index([order_id])
}
```

**Cambios:**
- ✅ `product_name` agregado (snapshot)
- ❌ `subtotal` removido (se calcula: price * quantity)
- ❌ Índice en `product_id` removido

---

## 💡 Ejemplos de Uso

### **Generar Order Number:**
```typescript
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 999) + 1;
  const counter = String(random).padStart(3, '0');
  
  return `MSC-${year}${month}${day}-${counter}`;
}

// Resultado: "MSC-20250110-001"
```

### **Crear Orden desde Carrito:**
```typescript
export async function createOrder(
  userId: string,
  addressId: string,
  customerNotes?: string
) {
  // 1. Obtener carrito
  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      },
    },
  });
  
  if (cartItems.length === 0) {
    throw new Error('Carrito vacío');
  }
  
  // 2. Validar stock
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new Error(`Stock insuficiente: ${item.product.name}`);
    }
  }
  
  // 3. Obtener dirección para snapshot
  const address = await prisma.address.findUniqueOrThrow({
    where: { id: addressId },
  });
  
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { name: true, phone: true },
  });
  
  // 4. Calcular totales
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.21; // 21% IVA
  const shipping_cost = 5.99;
  const total = subtotal + tax + shipping_cost;
  
  // 5. Crear orden
  const order = await prisma.order.create({
    data: {
      order_number: generateOrderNumber(),
      user_id: userId,
      
      subtotal,
      tax,
      shipping_cost,
      discount: 0,
      total,
      
      // Snapshot de dirección
      shipping_address: {
        name: user.name || 'Cliente',
        phone: user.phone || '',
        street: address.street,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.postal_code,
        country: address.country,
      },
      
      status: 'PENDING',
      payment_status: 'PENDING',
      payment_method: 'stripe',
      
      customer_notes: customerNotes,
      
      items: {
        create: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product.name, // ✅ Snapshot
          quantity: item.quantity,
          price: item.price, // ✅ Precio del carrito
        })),
      },
    },
    include: {
      items: true,
    },
  });
  
  // 6. Vaciar carrito
  await prisma.cartItem.deleteMany({
    where: { user_id: userId },
  });
  
  return order;
}
```

### **Actualizar Estado del Pedido:**
```typescript
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminNotes?: string
) {
  const updateData: any = {
    status,
    updated_at: new Date(),
  };
  
  // Actualizar timestamps según estado
  if (status === 'SHIPPED') {
    updateData.shipped_at = new Date();
  } else if (status === 'DELIVERED') {
    updateData.delivered_at = new Date();
  } else if (status === 'CANCELLED') {
    updateData.cancelled_at = new Date();
  }
  
  if (adminNotes) {
    updateData.admin_notes = adminNotes;
  }
  
  await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });
}
```

### **Actualizar Estado de Pago:**
```typescript
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  stripePaymentId?: string
) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      payment_status: paymentStatus,
      stripe_payment_id: stripePaymentId,
    },
  });
  
  // Si se pagó, actualizar a PROCESSING
  if (paymentStatus === 'PAID') {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
      },
    });
  }
}
```

### **Webhook de Stripe:**
```typescript
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Buscar orden por metadata
      const order = await prisma.order.findFirst({
        where: {
          stripe_payment_id: paymentIntent.id,
        },
      });
      
      if (order) {
        await updatePaymentStatus(
          order.id,
          'PAID',
          paymentIntent.id
        );
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      const failedOrder = await prisma.order.findFirst({
        where: {
          stripe_payment_id: failedPayment.id,
        },
      });
      
      if (failedOrder) {
        await updatePaymentStatus(
          failedOrder.id,
          'FAILED'
        );
      }
      break;
  }
}
```

### **Obtener Orden con Detalles:**
```typescript
export async function getOrderDetails(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              slug: true,
              thumbnail: true,
              is_active: true,
            },
          },
        },
      },
    },
  });
  
  return {
    ...order,
    shipping_address: order.shipping_address as ShippingAddress,
    items: order.items.map(item => ({
      ...item,
      subtotal: item.price * item.quantity,
    })),
  };
}
```

### **Tracking de Envío:**
```typescript
export async function updateTracking(
  orderId: string,
  trackingNumber: string
) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      tracking_number: trackingNumber,
      status: 'SHIPPED',
      shipped_at: new Date(),
    },
  });
  
  // Enviar email al cliente
  // await sendShippingEmail(order);
}
```

---

## 🎯 Ventajas del Nuevo Modelo

### **1. Dirección como Snapshot:**
```typescript
// Dirección guardada en el pedido
shipping_address: {
  name: "Juan Pérez",
  street: "Calle Principal 123",
  city: "Madrid",
  zip: "28001",
  phone: "+34 666 777 888"
}

// Si el usuario cambia su dirección después,
// el pedido mantiene la dirección original ✅
```

### **2. Estados Independientes:**
```typescript
// Pedido puede estar PROCESSING con pago FAILED
{
  status: 'PROCESSING',
  payment_status: 'FAILED'
}

// O SHIPPED con pago PAID
{
  status: 'SHIPPED',
  payment_status: 'PAID'
}
```

### **3. Product Name Snapshot:**
```typescript
// Si el admin cambia el nombre del producto,
// el pedido muestra el nombre original
orderItem: {
  product_name: "Alimento Premium Perros 15kg", // Original
  product: {
    name: "Super Premium Dog Food 15kg" // Nuevo
  }
}
```

### **4. Timestamps Completos:**
```typescript
{
  created_at: "2025-01-10 10:00:00",
  shipped_at: "2025-01-11 15:30:00",
  delivered_at: "2025-01-13 09:45:00",
  cancelled_at: null
}
```

---

## 🎨 UI Components

### **Order Status Badge:**
```tsx
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = {
    PENDING: { label: 'Pendiente', variant: 'secondary', icon: Clock },
    PROCESSING: { label: 'Procesando', variant: 'default', icon: Package },
    SHIPPED: { label: 'Enviado', variant: 'info', icon: Truck },
    DELIVERED: { label: 'Entregado', variant: 'success', icon: CheckCircle },
    CANCELLED: { label: 'Cancelado', variant: 'destructive', icon: XCircle },
    REFUNDED: { label: 'Reembolsado', variant: 'warning', icon: RefreshCw },
  };
  
  const { label, variant, icon: Icon } = config[status];
  
  return (
    <Badge variant={variant}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}
```

### **Payment Status Badge:**
```tsx
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = {
    PENDING: { label: 'Pago Pendiente', variant: 'secondary' },
    PAID: { label: 'Pagado', variant: 'success' },
    FAILED: { label: 'Pago Fallido', variant: 'destructive' },
    REFUNDED: { label: 'Reembolsado', variant: 'warning' },
  };
  
  const { label, variant } = config[status];
  
  return <Badge variant={variant}>{label}</Badge>;
}
```

### **Order Timeline:**
```tsx
export function OrderTimeline({ order }: { order: Order }) {
  const events = [
    { date: order.created_at, label: 'Pedido creado', status: 'completed' },
    { date: order.shipped_at, label: 'Enviado', status: order.shipped_at ? 'completed' : 'pending' },
    { date: order.delivered_at, label: 'Entregado', status: order.delivered_at ? 'completed' : 'pending' },
  ];
  
  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
          )}>
            {event.status === 'completed' && (
              <Check className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold">{event.label}</p>
            {event.date && (
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 API Routes

### **POST /api/orders - Crear Pedido:**
```typescript
export async function POST(request: Request) {
  const session = await getSession();
  const { address_id, customer_notes } = await request.json();
  
  const order = await createOrder(
    session.user.id,
    address_id,
    customer_notes
  );
  
  // Crear Payment Intent en Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: 'eur',
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
  
  // Guardar Stripe Payment ID
  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripe_payment_id: paymentIntent.id,
    },
  });
  
  return Response.json({
    order,
    client_secret: paymentIntent.client_secret,
  });
}
```

### **GET /api/orders/:id - Obtener Pedido:**
```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const order = await getOrderDetails(params.id);
  
  // Verificar que es del usuario
  if (order.user_id !== session.user.id && !session.user.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return Response.json(order);
}
```

---

## 📊 Types TypeScript

```typescript
interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: {
      slug: string;
      thumbnail: string | null;
      is_active: boolean;
    };
    subtotal: number;
  })[];
  shipping_address: ShippingAddress;
  user: {
    name: string | null;
    email: string;
  };
}
```

---

## ✅ Checklist de Actualización

### **Enums:**
- [x] ✅ PaymentStatus agregado
- [x] ✅ OrderStatus actualizado (sin CONFIRMED)

### **Order:**
- [x] ✅ `order_number` con formato MSC-YYYYMMDD-NNN
- [x] ✅ `shipping_address` como Json
- [x] ✅ `payment_status` agregado
- [x] ✅ `stripe_payment_id` agregado
- [x] ✅ `customer_notes` y `admin_notes` separados
- [x] ✅ `cancelled_at` agregado
- [x] ❌ `address_id` removido
- [x] ❌ `paid_at` removido
- [x] ❌ `deleted_at` removido

### **OrderItem:**
- [x] ✅ `product_name` agregado (snapshot)
- [x] ❌ `subtotal` removido (se calcula)

### **Índices:**
- [x] ✅ Simplificados (solo 3)

---

## 🚀 Aplicar Cambios

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

---

**📦 Sistema completo de pedidos con estados independientes y snapshots!** 🚀
