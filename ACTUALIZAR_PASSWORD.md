# 🔐 Actualizar Contraseña de Base de Datos

## ⚠️ IMPORTANTE: Falta la Contraseña de la Base de Datos

Las variables de entorno han sido actualizadas con el nuevo proyecto de Supabase:

**Nuevo Project ID:** `tbijzzdjjruegjlyebmk`

Pero necesitas completar la contraseña de la base de datos en los archivos `.env` y `.env.local`.

---

## 🔍 Cómo Obtener la Contraseña

### **Opción 1: Dashboard de Supabase (Recomendado)**

1. Ve al dashboard del proyecto:
   👉 https://app.supabase.com/project/tbijzzdjjruegjlyebmk/settings/database

2. En la sección **"Connection string"**, encontrarás:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres
   ```

3. Copia la contraseña que aparece en lugar de `[YOUR-PASSWORD]`

---

### **Opción 2: Desde la Configuración del Proyecto**

1. Ve a: https://app.supabase.com/project/tbijzzdjjruegjlyebmk/settings/database

2. Busca la sección **"Database Settings"**

3. Click en **"Reset Database Password"** si necesitas crear una nueva

4. Copia la nueva contraseña (¡guárdala en un lugar seguro!)

---

## ✏️ Actualizar los Archivos

Una vez tengas la contraseña, actualiza estos archivos:

### **1. `.env.local`**
```bash
DATABASE_URL="postgresql://postgres.TU_PASSWORD_AQUI@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.TU_PASSWORD_AQUI@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres"
```

### **2. `.env`**
```bash
DATABASE_URL="postgresql://postgres.TU_PASSWORD_AQUI@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.TU_PASSWORD_AQUI@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres"
```

**Reemplaza `TU_PASSWORD_AQUI` con la contraseña real.**

---

## 🔒 Formato Correcto

La URL de conexión debe verse así:

```
postgresql://postgres:tu_password_123@db.tbijzzdjjruegjlyebmk.supabase.co:5432/postgres
              ^              ^
              |              |
           usuario      contraseña
```

**Nota:** No uses corchetes `[]` en la contraseña real.

---

## ✅ Verificar la Configuración

### **Opción 1: Desde PowerShell**

```powershell
# Ver el contenido de .env.local (solo para verificar)
Get-Content .env.local
```

### **Opción 2: Test de Conexión**

Después de actualizar la contraseña:

```bash
# Iniciar el servidor
npm run dev

# Visitar la página de test
# http://localhost:3000/test
```

Si la conexión es exitosa, verás:
- ✅ Conexión exitosa con Supabase
- ✅ 7 tablas verificadas

---

## 🚨 Seguridad

**IMPORTANTE:**
- ❌ NO compartas tu contraseña de base de datos
- ❌ NO hagas commit de archivos `.env` o `.env.local`
- ✅ Verifica que `.gitignore` incluya `.env*`
- ✅ Usa variables de entorno en producción

---

## 📋 Checklist de Actualización

- [ ] Obtener contraseña desde Supabase Dashboard
- [ ] Actualizar `.env.local` con la contraseña
- [ ] Actualizar `.env` con la contraseña
- [ ] Reiniciar servidor de desarrollo (`npm run dev`)
- [ ] Verificar conexión en http://localhost:3000/test
- [ ] (Opcional) Probar `npx prisma db pull`

---

## 🆘 Problemas Comunes

### **Error: "password authentication failed"**
- Verifica que copiaste la contraseña correctamente
- Asegúrate de no incluir espacios extras
- No uses corchetes en la contraseña

### **Error: "could not translate host name"**
- Verifica que el Project ID sea correcto: `tbijzzdjjruegjlyebmk`
- Revisa la URL completa de conexión

### **Error: "Connection refused"**
- Verifica tu conexión a internet
- Comprueba que el proyecto de Supabase esté activo

---

## 🔄 Actualización Completada

Una vez actualices la contraseña:

```bash
# 1. Reinicia el servidor
npm run dev

# 2. Prueba la conexión
# Visita: http://localhost:3000/test

# 3. Sincroniza Prisma (si ya ejecutaste el SQL)
npx prisma db pull
npx prisma generate
```

---

## 📚 Próximos Pasos

Después de actualizar la contraseña:

1. ✅ **Ejecutar SQL en Supabase:**
   - Link: https://app.supabase.com/project/tbijzzdjjruegjlyebmk/sql/new
   - Archivo: `supabase-schema.sql`

2. ✅ **Probar la conexión:**
   - Visitar: http://localhost:3000/test

3. ✅ **Sincronizar Prisma:**
   - `npx prisma db pull`
   - `npx prisma generate`

---

**🔑 Nuevo Project ID de Supabase:** `tbijzzdjjruegjlyebmk`

