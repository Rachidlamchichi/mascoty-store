# 📍 Modelo Address Actualizado - Direcciones Completas

## 🎯 Cambios Implementados

Se ha actualizado el modelo Address con campos completos para direcciones de envío incluyendo etiquetas, nombre del destinatario y teléfono.

---

## 📝 Cambios Principales

### **1. Campos Nuevos:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `label` | String? | Etiqueta: "Casa", "Oficina", "Trabajo", etc. |
| `name` | String | Nombre del destinatario |
| `phone` | String | Teléfono de contacto |

#### **label (String?)**
```prisma
label  String?  // "Casa", "Oficina", etc
```

**Uso:**
- Identificar fácilmente la dirección
- Mejorar UX en selección de dirección
- Opcional (puede ser null)

**Ejemplos:**
- "Casa"
- "Oficina"
- "Casa de mis padres"
- "Trabajo"

#### **name (String)**
```prisma
name  String
```

**Uso:**
- Nombre del destinatario
- Puede ser diferente al nombre del usuario
- Útil para envíos a otra persona

**Ejemplos:**
- "Juan Pérez"
- "María García"
- "Empresa SA"

#### **phone (String)**
```prisma
phone  String
```

**Uso:**
- Contacto para entrega
- Requerido por transportistas
- Esencial para envíos

### **2. Campos Renombrados:**

| Antes | Después |
|-------|---------|
| `postal_code` | `zip_code` |

**Motivo:** Estándar internacional (más común)

### **3. Campos Modificados:**

```prisma
// ANTES
state  String

// DESPUÉS
state  String?  // Ahora opcional
```

**Motivo:** No todos los países tienen estados/provincias

### **4. Campos Removidos:**

- ❌ `street2` - Simplificado (todo en street)
- ❌ `deleted_at` - Soft delete removido

### **5. Índices Simplificados:**

```prisma
// ANTES
@@index([user_id])
@@index([is_default])  ❌
@@index([postal_code]) ❌

// DESPUÉS
@@index([user_id])
```

---

## 📋 Modelo Completo

```prisma
model Address {
  id          String    @id @default(uuid())
  
  user_id     String
  user        User
  
  label       String?   // "Casa", "Oficina"
  name        String    // Destinatario
  street      String
  city        String
  state       String?
  zip_code    String
  country     String    @default("España")
  phone       String
  
  is_default  Boolean   @default(false)
  
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  @@index([user_id])
}
```

---

## 💡 Ejemplos de Uso

### **Crear Dirección:**
```typescript
const address = await prisma.address.create({
  data: {
    user_id: userId,
    label: "Casa",
    name: "Juan Pérez",
    street: "Calle Mayor 123, Piso 3B",
    city: "Madrid",
    state: "Madrid",
    zip_code: "28001",
    country: "España",
    phone: "+34 666 777 888",
    is_default: true,
  },
});
```

### **Listar Direcciones del Usuario:**
```typescript
const addresses = await prisma.address.findMany({
  where: { user_id: userId },
  orderBy: [
    { is_default: 'desc' }, // Default primero
    { created_at: 'desc' },
  ],
});
```

### **Establecer como Predeterminada:**
```typescript
// 1. Quitar default de todas
await prisma.address.updateMany({
  where: { user_id: userId },
  data: { is_default: false },
});

// 2. Establecer la nueva como default
await prisma.address.update({
  where: { id: addressId },
  data: { is_default: true },
});
```

### **Actualizar Dirección:**
```typescript
await prisma.address.update({
  where: { id: addressId },
  data: {
    label: "Oficina",
    name: "Empresa SA",
    street: "Avenida Empresarial 456",
    city: "Barcelona",
    state: "Barcelona",
    zip_code: "08001",
    phone: "+34 933 444 555",
  },
});
```

### **Obtener Dirección Predeterminada:**
```typescript
const defaultAddress = await prisma.address.findFirst({
  where: {
    user_id: userId,
    is_default: true,
  },
});

// Si no tiene default, tomar la primera
if (!defaultAddress) {
  defaultAddress = await prisma.address.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' },
  });
}
```

### **Formatear para Envío:**
```typescript
function formatShippingAddress(address: Address) {
  return {
    name: address.name,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip_code,
    country: address.country,
  };
}

// Usar en Order
const order = await prisma.order.create({
  data: {
    // ...
    shipping_address: formatShippingAddress(address),
  },
});
```

---

## 🎯 Validaciones

### **Validar Código Postal (España):**
```typescript
function validateSpanishZipCode(zipCode: string): boolean {
  // Formato: 5 dígitos
  return /^\d{5}$/.test(zipCode);
}
```

### **Validar Teléfono (España):**
```typescript
function validateSpanishPhone(phone: string): boolean {
  // Formatos:
  // +34 666 777 888
  // 666 777 888
  // 666777888
  const cleaned = phone.replace(/\s+/g, '');
  return /^(\+34)?[6-9]\d{8}$/.test(cleaned);
}
```

### **Schema de Validación (Zod):**
```typescript
import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().max(50).optional(),
  name: z.string().min(2).max(100),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().max(100).optional(),
  zip_code: z.string().regex(/^\d{5}$/, 'Código postal inválido'),
  country: z.string().default('España'),
  phone: z.string().regex(/^(\+34)?[6-9]\d{8}$/, 'Teléfono inválido'),
  is_default: z.boolean().default(false),
});

type AddressInput = z.infer<typeof addressSchema>;
```

---

## 🎨 UI Components

### **Address Card:**
```tsx
interface AddressCardProps {
  address: Address;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <Card className={cn(
      "relative",
      address.is_default && "border-primary"
    )}>
      {address.is_default && (
        <Badge
          variant="default"
          className="absolute top-2 right-2"
        >
          Predeterminada
        </Badge>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {address.label && (
              <Badge variant="secondary" className="mb-2">
                {address.label}
              </Badge>
            )}
            <CardTitle className="text-lg">{address.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p>{address.street}</p>
            <p>
              {address.zip_code} {address.city}
              {address.state && `, ${address.state}`}
            </p>
            <p>{address.country}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{address.phone}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {!address.is_default && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
          >
            <Star className="h-4 w-4 mr-2" />
            Hacer predeterminada
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address.id)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(address.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### **Address Form:**
```tsx
export function AddressForm({ onSubmit, initialData }: Props) {
  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      country: 'España',
      is_default: false,
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Label (opcional) */}
        <FormField
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta (opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Casa, Oficina, etc."
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Nombre */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del destinatario</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Juan Pérez"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Calle */}
        <FormField
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Calle Mayor 123, Piso 3B"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Ciudad y Código Postal */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Madrid" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="28001" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        {/* Provincia (opcional) */}
        <FormField
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia (opcional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Madrid" />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Teléfono */}
        <FormField
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="+34 666 777 888"
                  type="tel"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Predeterminada */}
        <FormField
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                Establecer como predeterminada
              </FormLabel>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Guardar Dirección
        </Button>
      </form>
    </Form>
  );
}
```

### **Address Selector (Checkout):**
```tsx
export function AddressSelector({ value, onChange }: Props) {
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => fetch('/api/addresses').then(r => r.json()),
  });
  
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      {addresses?.map(address => (
        <div key={address.id} className="flex items-start space-x-2 p-4 border rounded-lg">
          <RadioGroupItem value={address.id} id={address.id} />
          <Label htmlFor={address.id} className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              {address.label && (
                <Badge variant="secondary" className="text-xs">
                  {address.label}
                </Badge>
              )}
              {address.is_default && (
                <Badge variant="default" className="text-xs">
                  Predeterminada
                </Badge>
              )}
            </div>
            <p className="font-semibold">{address.name}</p>
            <p className="text-sm text-muted-foreground">
              {address.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.zip_code} {address.city}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.phone}
            </p>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
```

---

## 🔄 API Routes

### **GET /api/addresses - Listar:**
```typescript
export async function GET(request: Request) {
  const session = await getSession();
  
  const addresses = await prisma.address.findMany({
    where: { user_id: session.user.id },
    orderBy: [
      { is_default: 'desc' },
      { created_at: 'desc' },
    ],
  });
  
  return Response.json(addresses);
}
```

### **POST /api/addresses - Crear:**
```typescript
export async function POST(request: Request) {
  const session = await getSession();
  const data = addressSchema.parse(await request.json());
  
  // Si es default, quitar default de las demás
  if (data.is_default) {
    await prisma.address.updateMany({
      where: { user_id: session.user.id },
      data: { is_default: false },
    });
  }
  
  const address = await prisma.address.create({
    data: {
      ...data,
      user_id: session.user.id,
    },
  });
  
  return Response.json(address);
}
```

### **PATCH /api/addresses/:id - Actualizar:**
```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const data = addressSchema.partial().parse(await request.json());
  
  // Verificar propiedad
  const address = await prisma.address.findUniqueOrThrow({
    where: { id: params.id },
  });
  
  if (address.user_id !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Si es default, quitar de las demás
  if (data.is_default) {
    await prisma.address.updateMany({
      where: {
        user_id: session.user.id,
        id: { not: params.id },
      },
      data: { is_default: false },
    });
  }
  
  const updated = await prisma.address.update({
    where: { id: params.id },
    data,
  });
  
  return Response.json(updated);
}
```

### **DELETE /api/addresses/:id - Eliminar:**
```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  
  const address = await prisma.address.findUniqueOrThrow({
    where: { id: params.id },
  });
  
  if (address.user_id !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  await prisma.address.delete({
    where: { id: params.id },
  });
  
  return Response.json({ success: true });
}
```

---

## ✅ Checklist de Actualización

### **Campos:**
- [x] ✅ `label` agregado (String?)
- [x] ✅ `name` agregado (String)
- [x] ✅ `phone` agregado (String)
- [x] ✅ `postal_code` → `zip_code`
- [x] ✅ `state` ahora opcional (String?)
- [x] ❌ `street2` removido
- [x] ❌ `deleted_at` removido

### **Índices:**
- [x] ✅ Simplificados (solo user_id)

### **Funcionalidad:**
- [x] ✅ Etiquetas para identificar
- [x] ✅ Nombre de destinatario
- [x] ✅ Teléfono requerido
- [x] ✅ Formato completo para envío

---

## 🚀 Aplicar Cambios

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

---

**📍 Modelo Address completo con etiquetas, destinatario y teléfono!** 🚀
