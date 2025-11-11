# 🚀 Guía de Despliegue: GitHub + Vercel

## ✅ Commit Realizado

He creado un commit con todos los cambios:
```
✅ 124 archivos modificados/creados
✅ 28,202 líneas añadidas
✅ Commit: "feat: Complete Mascoty store implementation with admin panel, auth, and all features"
```

---

## 📋 Paso 1: Crear Repositorio en GitHub

### **Opción A: Crear Repositorio Nuevo en GitHub**

1. **Ve a GitHub:**
   - https://github.com/new

2. **Configuración del repositorio:**
   ```
   Repository name:     mascoty-store
   Description:         E-commerce completo para tienda de mascotas con Next.js, Supabase y Stripe
   Visibility:          Public (o Private si prefieres)
   
   ⚠️ NO marques:
   - Add a README file
   - Add .gitignore
   - Choose a license
   ```

3. **Crea el repositorio** haciendo clic en "Create repository"

4. **Copia la URL** que aparecerá (algo como):
   ```
   https://github.com/TU-USUARIO/mascoty-store.git
   ```

---

## 📋 Paso 2: Conectar Repositorio Local con GitHub

### **Ejecuta estos comandos:**

```bash
# 1. Añadir el remote (usa TU URL de GitHub)
git remote add origin https://github.com/TU-USUARIO/mascoty-store.git

# 2. Verificar que se añadió correctamente
git remote -v

# 3. Hacer push a GitHub
git push -u origin master
```

### **Ejemplo completo:**
```bash
# Si tu usuario de GitHub es "juanperez"
git remote add origin https://github.com/juanperez/mascoty-store.git
git push -u origin master
```

---

## 📋 Paso 3: Configurar Variables de Entorno

### **Antes de desplegar, copia el contenido de tu `.env.local`:**

Necesitarás estas variables en Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-key

# Database (Prisma)
DATABASE_URL=tu-database-url

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-stripe-pk
STRIPE_SECRET_KEY=tu-stripe-sk
STRIPE_WEBHOOK_SECRET=tu-webhook-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# App URL (cambiar en producción)
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

---

## 📋 Paso 4: Desplegar en Vercel

### **Opción 1: Desde Vercel Dashboard (Recomendado)**

1. **Ve a Vercel:**
   - https://vercel.com

2. **Inicia sesión** (con GitHub si es posible)

3. **Click en "Add New Project"**

4. **Importar desde GitHub:**
   - Busca tu repositorio `mascoty-store`
   - Click en "Import"

5. **Configurar el proyecto:**
   ```
   Framework Preset:     Next.js
   Root Directory:       ./
   Build Command:        npm run build
   Output Directory:     .next
   Install Command:      npm install
   ```

6. **Añadir Variables de Entorno:**
   - Click en "Environment Variables"
   - Añade todas las variables de tu `.env.local`
   - ⚠️ **MUY IMPORTANTE:** No incluyas el `.env.local` en el repo

7. **Click en "Deploy"**

8. **Espera** (puede tardar 2-5 minutos)

9. **¡Listo!** Tu app estará en:
   ```
   https://mascoty-store-tu-usuario.vercel.app
   ```

---

### **Opción 2: Desde CLI de Vercel**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Desplegar
vercel

# 4. Seguir las instrucciones
```

---

## 📋 Paso 5: Configurar Webhooks

### **Stripe Webhook (Importante para pagos)**

1. **Ve a Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **Click en "Add endpoint"**

3. **URL del webhook:**
   ```
   https://tu-app.vercel.app/api/webhooks
   ```

4. **Eventos a escuchar:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. **Copia el Webhook Secret** y añádelo a Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## 📋 Paso 6: Actualizar URLs en Producción

### **Variables que debes actualizar en Vercel:**

```env
# Cambiar de localhost a tu dominio de Vercel
NEXT_PUBLIC_APP_URL=https://mascoty-store.vercel.app

# Verificar que apuntan a producción
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
```

### **Actualizar en Stripe:**
- Redirect URLs para OAuth (si usas)
- Success/Cancel URLs en checkout

---

## 🔧 Comandos Útiles

### **Para futuras actualizaciones:**

```bash
# 1. Hacer cambios en tu código

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "descripción de cambios"

# 4. Push a GitHub
git push origin master

# 5. Vercel desplegará automáticamente 🚀
```

### **Ver logs de despliegue:**
```bash
vercel logs
```

### **Ver dominios:**
```bash
vercel domains
```

---

## ✅ Checklist Final

Antes de considerar el deploy completo, verifica:

### **GitHub:**
- [ ] Repositorio creado
- [ ] Código subido
- [ ] `.env.local` NO está en el repo (debe estar en `.gitignore`)

### **Vercel:**
- [ ] Proyecto importado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] App funcionando en la URL

### **Supabase:**
- [ ] RLS configurado
- [ ] Políticas de seguridad activas
- [ ] URL de producción en variables

### **Stripe:**
- [ ] Webhook configurado
- [ ] URL apuntando a producción
- [ ] Webhook secret en Vercel

### **Funcionalidades:**
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Productos se cargan
- [ ] Checkout funciona
- [ ] Webhooks de Stripe responden

---

## 🐛 Troubleshooting

### **Error: "No se puede hacer push"**
```bash
git push -u origin master --force
```

### **Error: "Variables de entorno no definidas"**
- Verifica que todas las variables estén en Vercel Dashboard
- Redeploy después de añadir variables

### **Error: "Database connection failed"**
- Verifica `DATABASE_URL` en Vercel
- Asegúrate de que Supabase permite conexiones externas

### **Error: "Stripe webhook failed"**
- Verifica que el webhook secret sea correcto
- Revisa los logs en Stripe Dashboard

---

## 📚 Recursos

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase + Vercel:** https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- **Stripe Webhooks:** https://stripe.com/docs/webhooks

---

## 🎯 Próximos Pasos

1. ✅ Crear repositorio en GitHub
2. ✅ Conectar y hacer push
3. ✅ Configurar en Vercel
4. ✅ Añadir variables de entorno
5. ✅ Configurar webhooks
6. ✅ Verificar que todo funciona

---

**¡Tu tienda Mascoty estará en producción en minutos!** 🚀
