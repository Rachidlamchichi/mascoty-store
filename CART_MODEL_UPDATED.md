# 🛒 Modelo CartItem Actualizado

## 🎯 Cambios Implementados

Se ha actualizado el modelo CartItem con campo de precio congelado y simplificación de índices.

---

## 📝 Cambios Principales

### **1. Campo Nuevo:**

#### **price (Float)**
```prisma
price  Float  // precio al momento de agregar
```

**Uso:**
- Guardar el precio cuando se agrega al carrito
- Proteger contra cambios de precio
- Mostrar precio correcto en checkout

**Ventajas:**
- ✅ Usuario ve el precio que aceptó
- ✅ No se afecta por cambios de precio del producto
- ✅ Transparencia en el proceso de compra

**Ejemplo:**
```typescript
// Al agregar al carrito, guardar precio actual
const product = await prisma.product.findUnique({
  where: { id: productId },
});

await prisma.cartItem.create({
  data: {
    user_id: userId,
    product_id: productId,
    quantity: 1,
    price: product.price, // Precio congelado
  },
});
```

### **2. Índices Simplificados:**

**ANTES:**
```prisma
@@unique([user_id, product_id])
@@index([user_id])
@@index([product_id])  ❌
@@index([created_at])  ❌
```

**DESPUÉS:**
```prisma
@@unique([user_id, product_id])
@@index([user_id])
```

**Motivo:**
- Simplificación
- `product_id` no se consulta directamente
- `created_at` no es relevante para carrito
- Menos overhead

---

## 📋 Modelo Completo

```prisma
model CartItem {
  id          String    @id @default(uuid())
  
  user_id     String
  user        User      @relation(...)
  
  product_id  String
  product     Product   @relation(...)
  
  quantity    Int       @default(1)
  price       Float     // precio congelado
  
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  @@unique([user_id, product_id])
  @@index([user_id])
}
```

---

## 💡 Ejemplos de Uso

### **Agregar al Carrito:**
```typescript
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
) {
  // 1. Obtener producto actual
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: { 
      id: true, 
      price: true, 
      stock: true,
      is_active: true,
    },
  });
  
  // 2. Validaciones
  if (!product.is_active) {
    throw new Error('Producto no disponible');
  }
  
  if (product.stock < quantity) {
    throw new Error('Stock insuficiente');
  }
  
  // 3. Agregar o actualizar carrito
  const cartItem = await prisma.cartItem.upsert({
    where: {
      user_id_product_id: {
        user_id: userId,
        product_id: productId,
      },
    },
    update: {
      quantity: { increment: quantity },
      // NO actualizar price - mantener precio original
    },
    create: {
      user_id: userId,
      product_id: productId,
      quantity: quantity,
      price: product.price, // ✅ Guardar precio actual
    },
  });
  
  return cartItem;
}
```

### **Obtener Carrito con Cálculos:**
```typescript
export async function getCart(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          price: true, // Precio actual del producto
          stock: true,
          is_active: true,
        },
      },
    },
  });
  
  // Calcular totales
  const items = cartItems.map(item => {
    const currentPrice = item.product.price;
    const cartPrice = item.price;
    const priceChanged = currentPrice !== cartPrice;
    
    return {
      ...item,
      subtotal: item.price * item.quantity,
      priceChanged,
      priceDifference: priceChanged ? currentPrice - cartPrice : 0,
    };
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    subtotal,
    totalItems,
  };
}
```

### **Actualizar Cantidad:**
```typescript
export async function updateQuantity(
  userId: string,
  productId: string,
  quantity: number
) {
  // Validar stock
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });
  
  if (product.stock < quantity) {
    throw new Error('Stock insuficiente');
  }
  
  // Actualizar cantidad (NO precio)
  await prisma.cartItem.update({
    where: {
      user_id_product_id: {
        user_id: userId,
        product_id: productId,
      },
    },
    data: { quantity },
  });
}
```

### **Notificar Cambio de Precio:**
```typescript
export async function checkPriceChanges(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: userId },
    include: {
      product: {
        select: { price: true, name: true },
      },
    },
  });
  
  const changedItems = cartItems.filter(
    item => item.product.price !== item.price
  );
  
  if (changedItems.length > 0) {
    return {
      hasChanges: true,
      items: changedItems.map(item => ({
        name: item.product.name,
        oldPrice: item.price,
        newPrice: item.product.price,
        difference: item.product.price - item.price,
      })),
    };
  }
  
  return { hasChanges: false };
}
```

### **Actualizar Precios del Carrito:**
```typescript
// Admin tool o cron job
export async function syncCartPrices(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: userId },
    include: {
      product: { select: { price: true } },
    },
  });
  
  await prisma.$transaction(
    cartItems.map(item =>
      prisma.cartItem.update({
        where: { id: item.id },
        data: { price: item.product.price },
      })
    )
  );
}
```

### **Crear Orden desde Carrito:**
```typescript
export async function createOrderFromCart(
  userId: string,
  addressId: string
) {
  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: userId },
    include: {
      product: true,
    },
  });
  
  if (cartItems.length === 0) {
    throw new Error('Carrito vacío');
  }
  
  // Calcular totales usando precios del carrito
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const tax = subtotal * 0.21; // 21% IVA
  const shipping = 5.99;
  const total = subtotal + tax + shipping;
  
  // Crear orden
  const order = await prisma.order.create({
    data: {
      order_number: `ORD-${Date.now()}`,
      user_id: userId,
      address_id: addressId,
      subtotal,
      tax,
      shipping_cost: shipping,
      total,
      status: 'PENDING',
      items: {
        create: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price, // ✅ Usar precio del carrito
          subtotal: item.price * item.quantity,
        })),
      },
    },
  });
  
  // Vaciar carrito
  await prisma.cartItem.deleteMany({
    where: { user_id: userId },
  });
  
  return order;
}
```

---

## 🎯 Ventajas del Precio Congelado

### **1. Protección del Usuario:**
```typescript
// Escenario: Usuario agrega producto a $50
await addToCart(userId, productId, 1); // price: 50

// Admin sube precio a $60
await prisma.product.update({
  where: { id: productId },
  data: { price: 60 },
});

// Usuario ve en carrito el precio que aceptó ($50)
// No se sorprende en el checkout
```

### **2. Transparencia:**
```tsx
<CartItem>
  {item.priceChanged && (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Cambio de precio</AlertTitle>
      <AlertDescription>
        Este producto ahora cuesta ${item.product.price}
        {item.priceDifference > 0 ? ' (↑ más caro)' : ' (↓ más barato)'}
      </AlertDescription>
      <Button onClick={() => updateCartPrice(item.id)}>
        Actualizar precio
      </Button>
    </Alert>
  )}
</CartItem>
```

### **3. Auditoría:**
```typescript
// Saber exactamente qué precio vio el usuario
const cartHistory = await prisma.cartItem.findMany({
  where: { user_id: userId },
  select: {
    product_id: true,
    quantity: true,
    price: true, // Precio histórico
    created_at: true,
  },
});
```

---

## 🎨 UI Components

### **Cart Summary:**
```tsx
export function CartSummary({ cart }: { cart: Cart }) {
  const hasPriceChanges = cart.items.some(item => item.priceChanged);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Carrito</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPriceChanges && (
          <Alert variant="warning" className="mb-4">
            Algunos precios han cambiado. Revisa tu carrito.
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal ({cart.totalItems} items)</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>${SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${(cart.subtotal + SHIPPING_COST).toFixed(2)}</span>
          </div>
        </div>
        
        <Button className="w-full mt-4" onClick={handleCheckout}>
          Proceder al Pago
        </Button>
      </CardContent>
    </Card>
  );
}
```

### **Cart Item Row:**
```tsx
export function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <img 
        src={item.product.thumbnail} 
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        
        <div className="flex items-center gap-2 mt-2">
          {/* Precio congelado */}
          <span className="text-lg font-bold">
            ${item.price.toFixed(2)}
          </span>
          
          {/* Alerta si cambió */}
          {item.priceChanged && (
            <>
              <span className="text-sm line-through text-muted-foreground">
                ${item.product.price.toFixed(2)}
              </span>
              <Badge variant="warning" className="text-xs">
                Precio cambió
              </Badge>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <QuantitySelector
            value={item.quantity}
            max={item.product.stock}
            onChange={(qty) => updateQuantity(item.id, qty)}
          />
          <span className="text-sm text-muted-foreground">
            Subtotal: ${item.subtotal.toFixed(2)}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeFromCart(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## 🔄 API Routes

### **POST /api/cart - Agregar Item:**
```typescript
export async function POST(request: Request) {
  const session = await getSession();
  const { product_id, quantity } = await request.json();
  
  const cartItem = await addToCart(
    session.user.id,
    product_id,
    quantity
  );
  
  return Response.json(cartItem);
}
```

### **GET /api/cart - Obtener Carrito:**
```typescript
export async function GET(request: Request) {
  const session = await getSession();
  const cart = await getCart(session.user.id);
  return Response.json(cart);
}
```

### **PATCH /api/cart/:id - Actualizar Cantidad:**
```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const { quantity } = await request.json();
  
  const item = await prisma.cartItem.findUniqueOrThrow({
    where: { id: params.id },
  });
  
  if (item.user_id !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  await updateQuantity(session.user.id, item.product_id, quantity);
  
  return Response.json({ success: true });
}
```

---

## ✅ Checklist de Actualización

### **Campos:**
- [x] ✅ `price` agregado (Float)
- [x] ✅ Precio congelado al agregar

### **Índices:**
- [x] ✅ Simplificados (solo 2)
- [x] ❌ `product_id` removido
- [x] ❌ `created_at` removido

### **Funcionalidad:**
- [x] ✅ Guardar precio al agregar
- [x] ✅ No actualizar precio al cambiar cantidad
- [x] ✅ Notificar cambios de precio
- [x] ✅ Permitir actualización manual

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

**🛒 Modelo CartItem optimizado con precio congelado!** 🚀
