# 🔒 Checklist de Seguridad y Pre-Deploy

## ✅ Variables Sensibles Protegidas

### Backend (`server/.env`)
- [ ] ❌ **NO** está en el repositorio Git
- [ ] ✅ Está en `.gitignore`
- [ ] ✅ `.env.example` creado (sin datos reales)
- [ ] ✅ `MONGO_URI` contiene usuario y password reales
- [ ] ✅ `JWT_SECRET` es único y seguro (mínimo 32 caracteres)
- [ ] ✅ `EMAIL_PASS` es una App Password, no la contraseña normal

### Frontend (`.env`)
- [ ] ❌ **NO** necesita estar en Git (opcional para desarrollo local)
- [ ] ✅ `.env.example` creado
- [ ] ✅ `VITE_API_URL` apunta a la URL correcta en producción

---

## 🔐 Verificación de Archivos Sensibles

Ejecuta este comando para verificar que NO se subirán archivos sensibles:

```bash
git status
```

**NO deberías ver:**
- ❌ `server/.env`
- ❌ `.env`
- ❌ `server/uploads/` (archivos de usuarios)
- ❌ `node_modules/`

**SÍ deberías ver:**
- ✅ `server/.env.example`
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ Archivos de código fuente

---

## 🔑 Generar Credenciales Seguras

### 1. JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo en `server/.env`:
```env
JWT_SECRET=el_resultado_que_copiaste_aqui
```

###  2. MongoDB URI

Formato correcto:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Importante:**
- Reemplaza `username` y `password` con tus credenciales reales
- Reemplaza `cluster` con tu cluster de MongoDB Atlas
- Reemplaza `database` con el nombre de tu base de datos

### 3. Gmail App Password

**Pasos:**

1. Ve a [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (actívalo si no está)
3. Security → App Passwords
4. Select app: "Mail"
5. Select device: "Other" → "Conexa Server"
6. Copiar la contraseña de 16 caracteres (sin espacios)

```env
EMAIL_PASS=abcdefghijklmnop
```

---

## 🌐 Configuración de MongoDB Atlas

### IP Whitelist

Para desarrollo o servidores con IP dinámica (Vercel, Railway):

1. MongoDB Atlas → Network Access
2. Add IP Address
3. **Allow Access from Anywhere**: `0.0.0.0/0`

⚠️ **Recomendación:** En producción real, restringe a IPs específicas.

### Database User

1. Database Access → Add New Database User
2. Método: Password
3. Usuario: `conexa_admin`
4. Password: Genera una segura
5. Rol: `Atlas Admin` o `Read and Write to any database`

---

## 🚀 Variables para Vercel/Railway

### Backend (Railway Recomendado)

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/conexa?retryWrites=true&w=majority
JWT_SECRET=<tu_secreto_generado>
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=<app_password_16_chars>
CLIENT_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)

```env
VITE_API_URL=https://tu-backend.railway.app/api
```

---

## ✅ Verificación Final

### Antes de Push a GitHub

```bash
# 1. Verifica archivos que se subirán
git status

# 2. Verifica que .env NO esté incluido
git ls-files | grep .env

# Resultado esperado:
# .env.example      ← Este SÍ debe aparecer
# server/.env.example  ← Este SÍ debe aparecer
# .env              ← Este NO debe aparecer
# server/.env       ← Este NO debe aparecer
```

### Después de Deploy

- [ ] API responde en `https://tu-backend/api/products`
- [ ] Frontend carga sin errores CORS
- [ ] Login funciona
- [ ] Crear orden funciona
- [ ] Emails se envían correctamente
- [ ] Notifications se muestran

---

## 🚨 ¿Qué hacer si accidentalmente subiste .env?

Si ya hiciste push con `.env`:

1. **Cambiar TODAS las credenciales inmediatamente:**
   - Regenerar JWT_SECRET
   - Cambiar password de MongoDB
   - Cambiar app password de Gmail

2. **Eliminar .env del historial de Git:**

```bash
# Detener tracking del archivo
git rm --cached server/.env
git rm --cached .env

# Commit
git commit -m "Remove sensitive files"

# Push
git push
```

3. **Mejor opción:** Si el repo es nuevo y no hay colaboradores:

```bash
# Eliminar el repositorio de GitHub
# Crear uno nuevo
# Hacer push limpio
```

---

## 📝 Documentos de Referencia

- [README.md](README.md): Documentación completa del proyecto
- [DEPLOYMENT.md](DEPLOYMENT.md): Guía paso a paso de deployment
- [.env.example](server/.env.example): Template de variables backend
- [.env.example](.env.example): Template de variables frontend

---

## ✅ **Estás listo cuando:**

- [ ] `.gitignore` incluye `.env`, `node_modules`, `uploads/`
- [ ] `.env.example` creados (backend y frontend)
- [ ] Credenciales seguras generadas
- [ ] `git status` no muestra archivos sensibles
- [ ] Variables de entorno listas para Vercel/Railway
- [ ] MongoDB Atlas configurado correctamente

---

**🎉 ¡Ahora puedes hacer deploy con seguridad!**

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```
