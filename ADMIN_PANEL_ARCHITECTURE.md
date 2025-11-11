# 🎛️ Panel de Administración Mascoty - Arquitectura

## 📋 Estructura del Proyecto

```
src/app/admin/
├── layout.tsx                    # Layout del admin con sidebar
├── page.tsx                      # Dashboard principal
├── productos/
│   ├── page.tsx                 # Lista de productos
│   ├── nuevo/page.tsx          # Crear producto
│   └── [id]/editar/page.tsx   # Editar producto
├── categorias/
│   └── page.tsx                 # Gestión de categorías
├── marcas/
│   └── page.tsx                 # Gestión de marcas
├── pedidos/
│   ├── page.tsx                 # Lista de pedidos
│   └── [id]/page.tsx           # Detalle de pedido
├── reviews/
│   └── page.tsx                 # Gestión de reviews
├── clientes/
│   └── page.tsx                 # Lista de clientes
└── configuracion/
    └── page.tsx                 # Configuración general

src/components/admin/
├── layout/
│   ├── AdminSidebar.tsx        # Sidebar con navegación
│   ├── AdminHeader.tsx         # Header con usuario y búsqueda
│   └── AdminBreadcrumb.tsx     # Migas de pan
├── dashboard/
│   ├── StatsCard.tsx           # Tarjeta de estadística
│   ├── SalesChart.tsx          # Gráfica de ventas
│   └── TopProducts.tsx         # Top productos
├── productos/
│   ├── ProductTable.tsx        # Tabla de productos
│   ├── ProductFilters.tsx      # Filtros
│   ├── ProductForm.tsx         # Formulario principal
│   ├── ImageUploader.tsx       # Subir imágenes
│   └── RichTextEditor.tsx      # Editor de texto
├── pedidos/
│   ├── OrderTable.tsx          # Tabla de pedidos
│   ├── OrderStatusBadge.tsx    # Badge de estado
│   └── OrderTimeline.tsx       # Timeline de pedido
└── shared/
    ├── DataTable.tsx           # Tabla genérica
    ├── ConfirmDialog.tsx       # Diálogo de confirmación
    └── PageHeader.tsx          # Header de página
```

---

## 🎯 Secciones del Admin

### **1. Dashboard** 📊
- Cards con métricas principales
- Gráfica de ventas (7 días)
- Top 5 productos vendidos
- Pedidos recientes
- Alertas de stock bajo

### **2. Productos** 🛍️
- Lista con tabla paginada
- Filtros avanzados
- Búsqueda
- Formulario completo con:
  - Info básica
  - Precios e inventario
  - Imágenes (drag & drop)
  - Categorización
  - Detalles del producto
  - SEO

### **3. Categorías** 📂
- Estructura jerárquica (padre-hijo)
- Ordenar categorías
- Activar/desactivar

### **4. Marcas** 🏷️
- Lista de marcas
- Logo upload
- CRUD completo

### **5. Pedidos** 📦
- Lista con estados
- Filtros por estado/fecha
- Detalle completo
- Cambiar estado
- Imprimir factura

### **6. Reviews** ⭐
- Moderar reviews
- Aprobar/rechazar
- Responder a reviews

### **7. Clientes** 👥
- Lista de usuarios
- Ver pedidos del cliente
- Puntos de fidelidad

### **8. Configuración** ⚙️
- Info de la tienda
- Configuración de envío
- Métodos de pago
- Notificaciones

---

## 🔐 Protección

### **Middleware:**
```typescript
// Verificar que el usuario es admin
if (user?.role !== 'admin') {
  redirect('/')
}
```

### **RLS en Supabase:**
```sql
-- Solo admins pueden acceder
CREATE POLICY admin_only ON products
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🎨 Diseño

### **Colores:**
- Primary: Azul (#2563eb)
- Success: Verde (#10b981)
- Warning: Amarillo (#f59e0b)
- Danger: Rojo (#ef4444)

### **Layout:**
```
┌────────────────────────────────────┐
│ Header (Usuario, Búsqueda)        │
├──────┬─────────────────────────────┤
│      │                             │
│ Side │   Contenido Principal       │
│ bar  │                             │
│      │                             │
│      │                             │
└──────┴─────────────────────────────┘
```

---

## 📊 Librerías Recomendadas

### **Gráficas:**
```bash
npm install recharts
```

### **Tablas:**
```bash
npm install @tanstack/react-table
```

### **Editor de Texto:**
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### **Upload de Imágenes:**
- Cloudinary (ya configurado)
- react-dropzone

---

## 🚀 Plan de Implementación

### **Fase 1: Estructura Base**
1. ✅ Layout del admin
2. ✅ Dashboard principal
3. ✅ Componentes compartidos

### **Fase 2: Productos**
1. ✅ Lista de productos
2. ✅ Filtros y búsqueda
3. ✅ Formulario completo
4. ✅ Upload de imágenes

### **Fase 3: Pedidos**
1. ✅ Lista de pedidos
2. ✅ Detalle de pedido
3. ✅ Cambiar estado

### **Fase 4: Resto**
1. ✅ Categorías y marcas
2. ✅ Reviews
3. ✅ Clientes
4. ✅ Configuración

---

## 🔑 Funcionalidades Clave

### **Dashboard:**
- Ventas de hoy
- Ventas del mes
- Pedidos pendientes
- Stock bajo
- Gráfica de ventas
- Top productos

### **Productos:**
- CRUD completo
- Múltiples imágenes
- Categorización avanzada
- SEO
- Stock y precios
- Estado activo/inactivo

### **Pedidos:**
- Estados: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- Timeline visual
- Imprimir factura
- Email al cliente

### **Reviews:**
- Aprobar/rechazar
- Marcar como útil
- Responder

---

## 📱 Responsive

### **Desktop (md+):**
- Sidebar fijo
- Tabla completa
- Formularios en 2 columnas

### **Mobile (<md):**
- Sidebar colapsable
- Tabla adaptativa
- Formularios en 1 columna

---

## ✅ Checklist de Features

### **Dashboard:**
- [ ] Cards de métricas
- [ ] Gráfica de ventas
- [ ] Top productos
- [ ] Pedidos recientes
- [ ] Alertas de stock

### **Productos:**
- [ ] Lista con tabla
- [ ] Filtros
- [ ] Búsqueda
- [ ] Formulario completo
- [ ] Upload múltiple de imágenes
- [ ] Editor de texto enriquecido
- [ ] Categorización
- [ ] SEO

### **Pedidos:**
- [ ] Lista con estados
- [ ] Detalle completo
- [ ] Cambiar estado
- [ ] Timeline
- [ ] Imprimir

### **Otros:**
- [ ] Categorías CRUD
- [ ] Marcas CRUD
- [ ] Reviews moderación
- [ ] Clientes lista
- [ ] Configuración

---

**🎛️ Panel de administración profesional y completo para Mascoty** 🚀

**Próximo:** Comenzar implementación con Layout y Dashboard.
