# 🎨 Mascoty Theme Colors

## 🌈 Paleta de Colores

### **Colores Principales**

```css
--mascoty-primary: #FF6B35      /* Naranja cálido - energía y vitalidad */
--mascoty-secondary: #004E89     /* Azul confianza - profesionalismo */
--mascoty-accent: #F7B32B        /* Amarillo juguetón - alegría */
--mascoty-success: #06D6A0       /* Verde éxito */
--mascoty-warning: #F77F00       /* Naranja advertencia */
--mascoty-danger: #D62828        /* Rojo peligro */
```

### **Modo Oscuro (Dark Mode)**
Los colores se ajustan automáticamente para mejor contraste:

```css
--mascoty-primary: #FF7B4D       /* Naranja más brillante */
--mascoty-secondary: #1A6BA8     /* Azul más claro */
--mascoty-accent: #FFB83D        /* Amarillo más brillante */
--mascoty-success: #0FE4B0       /* Verde más brillante */
--mascoty-warning: #FF8F1A       /* Naranja más brillante */
--mascoty-danger: #E63939        /* Rojo más brillante */
```

---

## 📝 Uso en Tailwind CSS

### **Clases de Color**

Puedes usar estos colores con las utilidades estándar de Tailwind:

```tsx
// Texto
<p className="text-mascoty-primary">Texto naranja</p>
<p className="text-mascoty-secondary">Texto azul</p>

// Fondo
<div className="bg-mascoty-primary">Fondo naranja</div>
<div className="bg-mascoty-accent">Fondo amarillo</div>

// Borde
<div className="border-2 border-mascoty-primary">
  Con borde naranja
</div>

// Hover states
<button className="bg-mascoty-primary hover:bg-mascoty-warning">
  Hover naranja a amarillo
</button>

// Estados
<div className="bg-mascoty-success">Éxito</div>
<div className="bg-mascoty-warning">Advertencia</div>
<div className="bg-mascoty-danger">Error</div>
```

---

## 🎯 Guía de Uso

### **Primary (Naranja #FF6B35)**
- 🎯 **Uso:** Botones principales, CTAs, acciones importantes
- 🐾 **Simboliza:** Energía, entusiasmo, vitalidad de las mascotas
- ✅ **Cuándo usar:** Acciones primarias, destacar productos, botones de compra

```tsx
<button className="bg-mascoty-primary text-white px-6 py-3 rounded-lg">
  Comprar Ahora
</button>
```

### **Secondary (Azul #004E89)**
- 🎯 **Uso:** Headers, navegación, elementos de soporte
- 🛡️ **Simboliza:** Confianza, profesionalismo, seguridad
- ✅ **Cuándo usar:** Navegación, headers, información importante

```tsx
<nav className="bg-mascoty-secondary text-white">
  <h1>Mascoty</h1>
</nav>
```

### **Accent (Amarillo #F7B32B)**
- 🎯 **Uso:** Destacados, badges, notificaciones, ofertas
- ⚡ **Simboliza:** Alegría, juego, diversión
- ✅ **Cuándo usar:** Ofertas especiales, badges, elementos destacados

```tsx
<span className="bg-mascoty-accent text-black px-3 py-1 rounded-full">
  ¡Oferta! -20%
</span>
```

### **Success (Verde #06D6A0)**
- 🎯 **Uso:** Mensajes de éxito, confirmaciones
- ✅ **Simboliza:** Completado, disponible, saludable
- ✅ **Cuándo usar:** Confirmaciones, productos en stock, estados positivos

```tsx
<div className="bg-mascoty-success/10 border border-mascoty-success p-4 rounded">
  ✅ Producto agregado al carrito
</div>
```

### **Warning (Naranja #F77F00)**
- 🎯 **Uso:** Advertencias, stock bajo, acciones que requieren atención
- ⚠️ **Simboliza:** Precaución, atención requerida
- ✅ **Cuándo usar:** Stock bajo, advertencias, notificaciones importantes

```tsx
<div className="bg-mascoty-warning/10 border border-mascoty-warning p-4 rounded">
  ⚠️ Solo quedan 3 unidades
</div>
```

### **Danger (Rojo #D62828)**
- 🎯 **Uso:** Errores, eliminaciones, acciones destructivas
- ❌ **Simboliza:** Error, peligro, acción destructiva
- ✅ **Cuándo usar:** Errores, botones de eliminar, estados críticos

```tsx
<button className="bg-mascoty-danger text-white px-4 py-2 rounded">
  Eliminar Producto
</button>
```

---

## 🎨 Ejemplos de Componentes

### **Button Primary**
```tsx
<button className="bg-mascoty-primary hover:bg-mascoty-warning text-white font-semibold px-6 py-3 rounded-lg transition-colors">
  Agregar al Carrito 🛒
</button>
```

### **Card de Producto**
```tsx
<div className="border-2 border-mascoty-primary/20 rounded-xl p-6 hover:border-mascoty-primary transition-colors">
  <img src="..." alt="Producto" />
  <h3 className="text-mascoty-secondary font-bold text-xl">Producto</h3>
  <p className="text-gray-600">Descripción</p>
  <div className="flex justify-between items-center mt-4">
    <span className="text-2xl font-bold text-mascoty-primary">$29.99</span>
    <button className="bg-mascoty-accent text-black px-4 py-2 rounded">
      Comprar
    </button>
  </div>
</div>
```

### **Alert Success**
```tsx
<div className="bg-mascoty-success/10 border-l-4 border-mascoty-success p-4 rounded">
  <p className="text-mascoty-success font-semibold">
    ✅ ¡Pedido confirmado exitosamente!
  </p>
</div>
```

### **Badge de Oferta**
```tsx
<span className="inline-flex items-center gap-1 bg-mascoty-accent text-black px-3 py-1 rounded-full text-sm font-bold">
  🎉 OFERTA -25%
</span>
```

### **Navigation**
```tsx
<nav className="bg-mascoty-secondary text-white p-4">
  <div className="container mx-auto flex justify-between items-center">
    <h1 className="text-2xl font-bold">🐾 Mascoty</h1>
    <div className="flex gap-6">
      <a href="/productos" className="hover:text-mascoty-accent transition">
        Productos
      </a>
      <a href="/carrito" className="hover:text-mascoty-accent transition">
        Carrito
      </a>
    </div>
  </div>
</nav>
```

---

## 🔤 Tipografía

### **Fuentes Configuradas**

```css
--font-sans: Inter, sans-serif       /* Texto general */
--font-display: Poppins, sans-serif  /* Títulos y destacados */
```

### **Uso en Componentes**

```tsx
// Fuente general (por defecto)
<p className="font-sans">Texto normal con Inter</p>

// Títulos con Poppins
<h1 className="font-display text-4xl font-bold text-mascoty-secondary">
  Bienvenido a Mascoty
</h1>

// Combinación
<div>
  <h2 className="font-display text-2xl font-bold text-mascoty-primary mb-4">
    Productos Destacados
  </h2>
  <p className="font-sans text-gray-600">
    Encuentra los mejores productos para tu mascota
  </p>
</div>
```

---

## 🎨 Combinaciones Recomendadas

### **Hero Section**
```tsx
<section className="bg-mascoty-secondary text-white py-20">
  <div className="container mx-auto text-center">
    <h1 className="font-display text-5xl font-bold mb-6">
      🐾 Todo para tu Mascota
    </h1>
    <p className="font-sans text-xl mb-8 opacity-90">
      Los mejores productos al mejor precio
    </p>
    <button className="bg-mascoty-accent text-black px-8 py-4 rounded-lg font-bold hover:bg-mascoty-warning transition-colors">
      Ver Productos
    </button>
  </div>
</section>
```

### **Pricing Card**
```tsx
<div className="bg-white border-2 border-mascoty-primary rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
  <div className="text-center">
    <h3 className="font-display text-2xl font-bold text-mascoty-secondary mb-2">
      Plan Premium
    </h3>
    <div className="text-5xl font-bold text-mascoty-primary my-6">
      $29<span className="text-2xl">/mes</span>
    </div>
    <button className="w-full bg-mascoty-primary text-white py-3 rounded-lg font-semibold hover:bg-mascoty-warning transition-colors">
      Suscribirse Ahora
    </button>
  </div>
</div>
```

### **Product Status**
```tsx
<div className="flex items-center gap-2">
  {/* En stock */}
  <span className="flex items-center gap-1 text-mascoty-success">
    <div className="w-2 h-2 bg-mascoty-success rounded-full"></div>
    En Stock
  </span>
  
  {/* Stock bajo */}
  <span className="flex items-center gap-1 text-mascoty-warning">
    <div className="w-2 h-2 bg-mascoty-warning rounded-full"></div>
    Stock Bajo
  </span>
  
  {/* Agotado */}
  <span className="flex items-center gap-1 text-mascoty-danger">
    <div className="w-2 h-2 bg-mascoty-danger rounded-full"></div>
    Agotado
  </span>
</div>
```

---

## 🌓 Dark Mode

Los colores se ajustan automáticamente cuando activas el dark mode:

```tsx
// El componente funcionará en ambos modos
<div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
  <h2 className="text-mascoty-primary font-display text-2xl">
    Este color se adapta automáticamente
  </h2>
  <button className="bg-mascoty-accent text-black px-4 py-2 rounded">
    Botón adaptable
  </button>
</div>
```

---

## ✅ Checklist de Implementación

- [x] ✅ Colores primarios definidos
- [x] ✅ Modo oscuro configurado
- [x] ✅ Fuentes Inter y Poppins agregadas
- [x] ✅ Variables CSS en globals.css
- [x] ✅ Documentación de uso
- [ ] 🔄 Importar fuentes desde Google Fonts
- [ ] 🔄 Aplicar colores en componentes existentes
- [ ] 🔄 Crear paleta de componentes reutilizables

---

## 🎓 Próximos Pasos

1. **Importar fuentes:** Agregar Inter y Poppins desde Google Fonts en `layout.tsx`
2. **Aplicar tema:** Actualizar componentes existentes con los nuevos colores
3. **Crear biblioteca:** Desarrollar componentes reutilizables con estos colores
4. **Testing:** Verificar contraste y accesibilidad en ambos modos

---

## 📚 Recursos

- **Tailwind Colors:** https://tailwindcss.com/docs/customizing-colors
- **Color Picker:** https://colorhunt.co
- **Accessibility Checker:** https://webaim.org/resources/contrastchecker/

---

**🎨 Paleta Mascoty configurada y lista para usar!** 🐾

