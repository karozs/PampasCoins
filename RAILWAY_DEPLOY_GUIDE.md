# 🚂 Guía de Deploy en Railway - PampasCoins

## 📋 Requisitos Previos

- [ ] Cuenta en [Railway.app](https://railway.app)
- [ ] Código subido a GitHub
- [ ] Git push completado (ya lo tienes corriendo)

---

## 🎯 Paso 1: Preparar el Proyecto

### 1.1 Crear archivos de configuración

Necesitamos crear algunos archivos para que Railway sepa cómo desplegar tu aplicación.

#### A) Crear `railway.json` en la raíz del proyecto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### B) Crear `Procfile` en la raíz del proyecto:

```
web: cd backend && node server.js
```

#### C) Actualizar `package.json` en la raíz (si no existe, créalo):

```json
{
  "name": "pampascoins",
  "version": "1.0.0",
  "scripts": {
    "start": "cd backend && node server.js",
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm install && npm run build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🎯 Paso 2: Configurar Railway

### 2.1 Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu cuenta de GitHub si no lo has hecho
5. Selecciona el repositorio **PampasCoins**

### 2.2 Agregar Base de Datos MySQL

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"Database"**
3. Elige **"Add MySQL"**
4. Railway creará automáticamente una base de datos MySQL

### 2.3 Conectar Backend con MySQL

Railway generará automáticamente las variables de entorno. Necesitas:

1. Haz clic en tu servicio de **MySQL**
2. Ve a la pestaña **"Variables"**
3. Copia estas variables (Railway las genera automáticamente):
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`

4. Haz clic en tu servicio de **Backend** (el que tiene tu código)
5. Ve a **"Variables"** y agrega:

```
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}
PORT=3000
NODE_ENV=production
```

**Nota:** Railway usa referencias como `${{MySQL.VARIABLE}}` para conectar servicios automáticamente.

---

## 🎯 Paso 3: Configurar el Backend

### 3.1 Actualizar `backend/server.js`

Asegúrate de que tu servidor use el puerto de Railway:

```javascript
const PORT = process.env.PORT || 3000;
```

### 3.2 Configuración de CORS

Actualiza CORS para permitir tu dominio de Railway:

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
```

---

## 🎯 Paso 4: Inicializar la Base de Datos

### 4.1 Conectarse a MySQL de Railway

Opción 1: **Usar Railway CLI** (Recomendado)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Conectar a MySQL
railway connect MySQL
```

Opción 2: **Usar cliente MySQL local**

Usa las credenciales de Railway (Variables → MySQL) para conectarte con MySQL Workbench o phpMyAdmin.

### 4.2 Ejecutar el Schema

Una vez conectado a MySQL:

```sql
-- Copiar y pegar todo el contenido de backend/schema.sql
```

O si usas Railway CLI:

```bash
railway run mysql -u root -p < backend/schema.sql
```

---

## 🎯 Paso 5: Desplegar el Frontend

### 5.1 Opción A: Frontend en Railway (Mismo proyecto)

1. En Railway, haz clic en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona el mismo repositorio
4. Configura las variables:

**Root Directory:** `frontend`

**Build Command:** `npm install && npm run build`

**Start Command:** `npx serve -s dist -p $PORT`

**Variables de entorno:**
```
VITE_API_URL=https://tu-backend-railway.up.railway.app
```

### 5.2 Opción B: Frontend en Vercel (Recomendado)

Si prefieres Vercel para el frontend:

**Configuración en Vercel:**
- Framework Preset: **Vite**
- Root Directory: **frontend**
- Build Command: **npm run build**
- Output Directory: **dist**

**Variable de entorno:**
```
VITE_API_URL=https://tu-backend-railway.up.railway.app
```

---

## 🎯 Paso 6: Verificación y Testing

### 6.1 Verificar el Deploy

1. **Backend**: Ve a tu servicio de backend en Railway
   - Haz clic en **"Deployments"**
   - Verifica que el deploy sea exitoso (✅)
   - Copia la URL pública (ej: `https://pampascoins-backend.up.railway.app`)

2. **Base de datos**: 
   - Ve al servicio MySQL
   - Verifica que esté corriendo

3. **Frontend**:
   - Verifica que el build sea exitoso
   - Copia la URL pública

### 6.2 Probar la Aplicación

1. Abre la URL del frontend
2. Intenta registrarte
3. Intenta hacer login
4. Verifica que todas las funciones trabajen

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Solución:**
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de usar `${{MySQL.VARIABLE}}` en lugar de valores hardcodeados
- Revisa los logs: Railway → Backend → Deployments → View Logs

### Error: "Build failed"

**Solución:**
- Verifica que `package.json` tenga el script `start`
- Revisa los logs de build
- Asegúrate de que `node_modules` NO esté en git

### Error: "CORS policy"

**Solución:**
Actualiza CORS en `backend/server.js`:

```javascript
app.use(cors({
    origin: [
        'https://tu-frontend.vercel.app',
        'https://tu-frontend.railway.app',
        'http://localhost:5173'
    ],
    credentials: true
}));
```

### Frontend no se conecta al Backend

**Solución:**
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que la URL del backend sea HTTPS
- Verifica que el backend esté corriendo

---

## 📝 Checklist Final

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] MySQL agregado y corriendo
- [ ] Variables de entorno configuradas
- [ ] Schema ejecutado en la base de datos
- [ ] Backend desplegado y corriendo
- [ ] Frontend desplegado (Railway o Vercel)
- [ ] CORS configurado correctamente
- [ ] Aplicación probada y funcionando

---

## 🎉 ¡Listo!

Tu aplicación PampasCoins ahora está desplegada en producción.

**URLs importantes:**
- Backend: `https://tu-proyecto.up.railway.app`
- Frontend: `https://tu-proyecto.vercel.app` o `https://tu-proyecto.railway.app`
- Base de datos: Accesible solo desde Railway

---

## 📚 Recursos Adicionales

- [Railway Docs](https://docs.railway.app)
- [Railway MySQL Guide](https://docs.railway.app/databases/mysql)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🔄 Actualizaciones Futuras

Para actualizar tu aplicación:

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Update: descripción del cambio"
   git push origin main
   ```
3. Railway detectará automáticamente los cambios y redesplegará

¡Eso es todo! 🚀
