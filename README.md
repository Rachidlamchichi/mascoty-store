# 🐾 Mascoty - E-commerce para Tienda de Mascotas

E-commerce completo y profesional para tienda de productos para mascotas. Incluye panel de administración, sistema de autenticación, carrito de compras, checkout con Stripe, gestión de pedidos, reviews, suscripciones y más.

## ✨ Características Principales

### **Para Clientes:**
- 🛍️ Catálogo de productos con filtros avanzados
- 🛒 Carrito de compras persistente
- 💳 Checkout seguro con Stripe
- 👤 Perfiles de usuario con información de mascotas
- ⭐ Sistema de reviews con fotos
- 📦 Seguimiento de pedidos
- 🔄 Suscripciones recurrentes
- 🎁 Sistema de fidelidad con tiers (Bronze, Silver, Gold)

### **Panel de Administración:**
- 📊 Dashboard con métricas y gráficas
- 📦 Gestión completa de productos (CRUD)
- 📂 Categorías jerárquicas con drag & drop
- 🏷️ Gestión de marcas
- 📋 Gestión de pedidos con estados
- 👥 Administración de clientes
- ⭐ Moderación de reviews
- 📈 Estadísticas y reportes
- ⚙️ Configuración de la tienda

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Base de Datos:** Supabase + Prisma ORM
- **Autenticación:** Supabase Auth
- **Pagos:** Stripe
- **Upload de Imágenes:** Cloudinary
- **UI:** shadcn/ui + Tailwind CSS
- **Estado:** Zustand
- **Forms:** React Hook Form + Zod
- **Gráficas:** Recharts

## 🚀 Inicio Rápido

### **Prerequisitos:**
- Node.js 18+
- Cuenta de Supabase
- Cuenta de Stripe
- Cuenta de Cloudinary

### **Instalación:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/mascoty-store.git
cd mascoty-store

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Configurar base de datos
npx prisma generate
npx prisma db push

# 5. Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno Requeridas:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Estructura del Proyecto

```
mascoty/
├── src/
│   ├── app/              # Pages y routes
│   │   ├── (auth)/      # Páginas de autenticación
│   │   ├── (shop)/      # Páginas de la tienda
│   │   ├── admin/       # Panel de administración
│   │   └── cuenta/      # Área de usuario
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes de shadcn/ui
│   │   ├── product/     # Componentes de productos
│   │   ├── cart/        # Componentes del carrito
│   │   └── layout/      # Header, Footer, Nav
│   ├── lib/             # Configuraciones y utilidades
│   │   ├── supabase/    # Cliente de Supabase
│   │   ├── stripe/      # Cliente de Stripe
│   │   └── prisma.ts    # Cliente de Prisma
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Schema de base de datos
└── public/              # Assets estáticos
```

## 🗄️ Modelo de Datos

El proyecto incluye los siguientes modelos principales:

- **User** - Usuarios del sistema
- **Pet** - Mascotas de los usuarios
- **Product** - Productos de la tienda
- **Category** - Categorías de productos
- **Brand** - Marcas
- **Order** - Pedidos
- **OrderItem** - Items de pedidos
- **Review** - Reviews de productos
- **Subscription** - Suscripciones recurrentes
- **CartItem** - Items del carrito
- **Address** - Direcciones de envío

Ver `prisma/schema.prisma` para el schema completo.

## 📖 Documentación

El proyecto incluye documentación detallada en archivos markdown:

- `ADMIN_PANEL_ARCHITECTURE.md` - Arquitectura del panel de admin
- `AUTH_PAGES_COMPLETED.md` - Sistema de autenticación
- `SCHEMA_FINAL_COMPLETADO.md` - Schema de base de datos
- `DEPLOY_GITHUB_VERCEL.md` - Guía de despliegue
- Y muchos más...

## 🚀 Despliegue

### **Vercel (Recomendado):**

1. Push a GitHub
2. Importar en Vercel
3. Configurar variables de entorno
4. Deploy automático

Ver `DEPLOY_GITHUB_VERCEL.md` para instrucciones detalladas.

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- Middleware de autenticación en rutas protegidas
- Validación de datos con Zod
- Políticas de acceso por roles (admin/cliente)
- Variables de entorno nunca commitadas

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npx prisma studio    # Ver base de datos
npx prisma generate  # Generar cliente Prisma
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una branch para tu feature
3. Commit tus cambios
4. Push a la branch
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso exclusivo.

## 👤 Autor

Desarrollado con ❤️ para Mascoty

---

**🐾 ¡Gracias por usar Mascoty!**
