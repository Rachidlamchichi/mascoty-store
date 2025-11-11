# 🚀 Pasos Finales: GitHub → Vercel

## ✅ Estado Actual

```
✅ Código commitado localmente (2 commits)
✅ 124 archivos listos para subir
✅ README.md profesional creado
✅ Guía de despliegue incluida
✅ .gitignore configurado correctamente
```

---

## 📋 PASO 1: Crear Repositorio en GitHub

### **1.1 Ve a GitHub:**
👉 https://github.com/new

### **1.2 Configuración:**
```
Repository name:     mascoty-store
Description:         E-commerce completo para tienda de mascotas
Visibility:          Public (o Private)

⚠️ NO MARQUES NADA MÁS:
❌ Add a README file
❌ Add .gitignore
❌ Choose a license
```

### **1.3 Crear repositorio:**
- Click en "Create repository"
- **Copia la URL** que aparecerá (algo como):
  ```
  https://github.com/TU-USUARIO/mascoty-store.git
  ```

---

## 📋 PASO 2: Conectar y Subir a GitHub

### **2.1 Abre una terminal en la carpeta del proyecto:**

### **2.2 Ejecuta estos comandos (UNO POR UNO):**

```bash
# Comando 1: Añadir el remote (REEMPLAZA TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/mascoty-store.git

# Comando 2: Verificar que se añadió
git remote -v

# Comando 3: Subir todo a GitHub
git push -u origin master
```

### **Ejemplo si tu usuario es "juanperez":**
```bash
git remote add origin https://github.com/juanperez/mascoty-store.git
git remote -v
git push -u origin master
```

### **2.3 Resultado esperado:**
```
✅ Enumerating objects: ...
✅ Writing objects: 100% ...
✅ Branch 'master' set up to track remote branch 'master' from 'origin'
```

---

## 📋 PASO 3: Desplegar en Vercel

### **3.1 Ve a Vercel:**
👉 https://vercel.com

### **3.2 Iniciar sesión:**
- Usa "Continue with GitHub" (recomendado)

### **3.3 Importar proyecto:**
1. Click en **"Add New Project"**
2. Click en **"Import Git Repository"**
3. Busca tu repo **"mascoty-store"**
4. Click en **"Import"**

### **3.4 Configurar proyecto:**
```
Framework Preset:     Next.js (detectado automáticamente)
Root Directory:       ./ (dejar por defecto)
Build Command:        npm run build (dejar por defecto)
Install Command:      npm install (dejar por defecto)
```

### **3.5 Añadir Variables de Entorno:**

**⚠️ MUY IMPORTANTE:** Antes de hacer deploy, añade TODAS las variables:

Click en **"Environment Variables"** y añade:

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

# App URL (actualizar después)
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### **3.6 Desplegar:**
1. Click en **"Deploy"**
2. **Espera 2-5 minutos** (verás logs en tiempo real)
3. ✅ ¡Deploy exitoso!

### **3.7 Tu app estará en:**
```
https://mascoty-store-tu-usuario.vercel.app
```

---

## 📋 PASO 4: Configurar Webhooks de Stripe

### **4.1 Copiar URL de tu app:**
```
https://tu-app.vercel.app
```

### **4.2 Ve a Stripe Dashboard:**
👉 https://dashboard.stripe.com/webhooks

### **4.3 Añadir endpoint:**
1. Click en **"Add endpoint"**
2. URL: `https://tu-app.vercel.app/api/webhooks`
3. Eventos a escuchar:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
4. Click en **"Add endpoint"**

### **4.4 Copiar Webhook Secret:**
- Aparecerá algo como: `whsec_xxxxxxxxxxxxx`
- Cópialo

### **4.5 Actualizar en Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Busca `STRIPE_WEBHOOK_SECRET`
4. Click en **"Edit"**
5. Pega el nuevo webhook secret
6. Guarda
7. **Redeploy** el proyecto (Settings → Deployments → ... → Redeploy)

---

## 📋 PASO 5: Actualizar URL de la App

### **5.1 En Vercel:**
1. Settings → Environment Variables
2. Busca `NEXT_PUBLIC_APP_URL`
3. Cambia de `http://localhost:3000` a:
   ```
   https://tu-app.vercel.app
   ```
4. Guarda
5. **Redeploy**

---

## 📋 PASO 6: Verificar que Todo Funciona

### **Checklist:**
- [ ] La app se ve correctamente
- [ ] Puedes hacer login/registro
- [ ] Los productos se cargan
- [ ] El carrito funciona
- [ ] El checkout con Stripe funciona
- [ ] Los webhooks de Stripe responden

### **Probar:**
1. Ve a tu app: `https://tu-app.vercel.app`
2. Navega por las páginas
3. Crea una cuenta
4. Prueba añadir al carrito
5. Haz un checkout de prueba (usa tarjeta de test de Stripe)

---

## 🔄 Para Futuras Actualizaciones

```bash
# 1. Hacer cambios en tu código localmente

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "descripción de tus cambios"

# 4. Push a GitHub
git push origin master

# 5. Vercel desplegará automáticamente 🚀
```

---

## 🐛 Problemas Comunes

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/mascoty-store.git
```

### **Error: "No se puede hacer push"**
```bash
git push -u origin master --force
```

### **Error en Vercel: "Build failed"**
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

### **Error: "Database connection failed"**
- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de que Supabase permite conexiones externas

---

## ✅ Checklist Final

### **GitHub:**
- [ ] Repositorio creado
- [ ] Código subido
- [ ] README visible

### **Vercel:**
- [ ] Proyecto importado
- [ ] Variables de entorno configuradas (11 variables)
- [ ] Deploy exitoso
- [ ] App accesible en la URL

### **Stripe:**
- [ ] Webhook configurado
- [ ] Webhook secret actualizado en Vercel
- [ ] Probado con pago de prueba

### **Funcional:**
- [ ] Login/Registro funciona
- [ ] Productos se cargan
- [ ] Checkout funciona
- [ ] Panel de admin accesible (si tienes rol admin)

---

## 📚 Recursos

- **Guía completa:** Lee `DEPLOY_GITHUB_VERCEL.md`
- **Vercel Docs:** https://vercel.com/docs
- **Supabase + Vercel:** https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

---

## 🎯 Resumen de URLs

```
GitHub Repo:     https://github.com/TU-USUARIO/mascoty-store
Vercel App:      https://mascoty-store-xxx.vercel.app
Vercel Dashboard: https://vercel.com/dashboard
Stripe Webhooks: https://dashboard.stripe.com/webhooks
```

---

**🚀 ¡Listo para desplegar!**

Sigue los pasos en orden y tu tienda Mascoty estará en producción en menos de 30 minutos.
