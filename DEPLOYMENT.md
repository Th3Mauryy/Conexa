# 🚀 Guía Rápida de Deployment

## 📋 Checklist Pre-Deploy

### ✅ Seguridad
- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` creado (sin datos reales)
- [ ] Contraseñas seguras generadas
- [ ] Variables de entorno listas para Vercel

### ✅ Código
- [ ] No hay console.logs innecesarios
- [ ] Rutas API funcionan localmente
- [ ] Build de producción funciona (`npm run build`)

---

## 🎯 Opción 1: Vercel (Recomendado para Frontend)

### Frontend

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Build y Deploy**
```bash
# Desde la raíz del proyecto
npm run build
vercel --prod
```

3. **Variables de Entorno en Vercel**

Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://conexa-backend.vercel.app
```

### Backend (⚠️ Limitación: Cron jobs NO funcionan en Vercel)

1. **Deploy**
```bash
cd server
vercel --prod
```

2. **Variables en Vercel** (Dashboard del backend)

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto_generado
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
CLIENT_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

---

## 🚂 Opción 2: Railway (Mejor para Backend)

**¿Por qué Railway?** Los cron jobs SÍ funcionan (recordatorios de pago, cancelaciones automáticas).

1. Ir a [railway.app](https://railway.app)
2. Sign in con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Seleccionar `Th3Mauryy/Conexa`
5. En Settings:
   - Root Directory: `server`
   - Build Command: (dejar vacío, usa npm install automático)
   - Start Command: `npm start`

6. **Variables de Entorno** (Settings → Variables)

Agregar todas las del `.env.example` con valores reales.

7. Deploy automático cada push a `main`

---

## 📝 Variables de Entorno - Lista Completa

### Backend (Obligatorias)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/conexa?retryWrites=true&w=majority
JWT_SECRET=<genera uno con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=<app password de 16 caracteres>
CLIENT_URL=https://tu-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (Opcional)

```env
VITE_API_URL=https://conexa-backend.railway.app
```

Si no defines `VITE_API_URL`, el frontend usará `/api` (proxy).

---

## 🔐 Generar Contraseña de App de Gmail

1. Ve a https://myaccount.google.com/security
2. Activa "Verificación en dos pasos"
3. Busca "Contraseñas de aplicaciones"
4. Selecciona "Correo" y "Otro dispositivo"
5. Copia la contraseña de 16 caracteres
6. Usa esa en `EMAIL_PASS`

---

## 🔑 Generar JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo en `JWT_SECRET`.

---

## 🌍 MongoDB Atlas - IP Whitelist

Para Railway o Vercel (IPs dinámicas):

1. MongoDB Atlas → Network Access
2. "Add IP Address"
3. Seleccionar "Allow Access from Anywhere" (`0.0.0.0/0`)

⚠️ En producción real, considera usar IPs específicas o VPCs.

---

## 📦 Subir a GitHub

```bash
cd "c:\Users\maury\OneDrive\Escritorio\original residencia\conexa"

# Verificar que .env no esté incluido
git status

# Agregar todos los archivos
git add .

# Commit
git commit -m "Initial commit - Conexa E-commerce Platform"

# Push al repositorio remoto
git push -u origin main
```

---

## ✅ Verificación Post-Deploy

### Frontend
- [ ] Página carga sin errores
- [ ] Logos e imágenes se ven
- [ ] Puedo navegar entre páginas

### Backend
- [ ] API responde en `/api/products`
- [ ] Login funciona
- [ ] Órdenes se crean correctamente

### Emails
- [ ] Email de confirmación llega
- [ ] Recordatorio de pago funciona (esperar 14h o probar manual)

### Notificaciones
- [ ] Campanita muestra notificaciones
- [ ] Contador actualiza correctamente

---

## 🚨 Troubleshooting Común

### "500 Internal Server Error" en Vercel

- Revisa los logs: `vercel logs <url>`
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `MONGO_URI` sea accesible

### "CORS Error"

En `server/index.js`, asegúrate de que CORS permita tu frontend:

```javascript
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
```

### Cron Jobs no funcionan

- ❌ Vercel: No soporta cron jobs
- ✅ Railway: Funciona perfectamente
- ✅ Render/Heroku: También funcionan

---

## 🎉 ¡Listo para Deploy!

1. Push a GitHub ✅
2. Deploy Frontend a Vercel ✅
3. Deploy Backend a Railway ✅
4. Configurar variables de entorno ✅
5. ¡A vender! 🛒

---

**Documentación completa:** Ver [README.md](README.md)
