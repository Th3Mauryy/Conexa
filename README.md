# 🛒 Conexa - E-commerce Platform

Plataforma completa de e-commerce con gestión de productos, órdenes, notificaciones y sistema de reseñas.

## 🚀 Características

### Para Clientes
- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Carrito de compras con stock en tiempo real
- ✅ Sistema de órdenes con seguimiento
- ✅ Notificaciones de campana para actualizaciones
- ✅ Recordatorios de pago automáticos
- ✅ Reseñas de productos (solo para compras entregadas)
- ✅ Lista de deseos
- ✅ Perfil de usuario con foto y dirección

### Para Administradores
- ✅ Panel de administración completo
- ✅ Gestión de productos y categorías
- ✅ Notificaciones de órdenes y pagos
- ✅ Actualización de estados de órdenes
- ✅ Reportes e inventario

### Sistema Automático
- ✅ Recordatorio de pago a las 14 horas (10h antes de cancelar)
- ✅ Cancelación automática de órdenes sin pago a las 24h
- ✅ Restauración automática de stock al cancelar
- ✅ Emails transaccionales (confirmación, pago, recordatorios, cancelación)

## 📋 Requisitos Previos

- Node.js 16+ y npm
- MongoDB Atlas (cuenta gratuita)
- Cuenta de Gmail con contraseña de aplicación (para emails)

## 🔧 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Th3Mauryy/Conexa.git
cd Conexa
```

### 2. Configurar el Backend

```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server/` basado en `.env.example`:

```env
MONGO_URI=tu_mongo_uri_aqui
JWT_SECRET=genera_un_secreto_seguro_de_32_caracteres
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Generar contraseña de aplicación Gmail:**
1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Activa la verificación en dos pasos
3. Ve a "Contraseñas de aplicaciones"
4. Genera una contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres en `EMAIL_PASS`

Iniciar el servidor:

```bash
npm start
```

### 3. Configurar el Frontend

En una nueva terminal:

```bash
cd ..  # Vuelve a la raíz del proyecto
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 4. Poblar la Base de Datos (Opcional)

Para crear productos y categorías de ejemplo:

```bash
cd server
node seeder.js
```

## 🌐 Deployment a Vercel

### Opción A: Deploy del Frontend (Recomendado para iniciar)

1. **Preparar el Frontend**

```bash
# En la raíz del proyecto
npm run build
```

2. **Deploy a Vercel**

```bash
# Instala Vercel CLI si no la tienes
npm i -g vercel

# Deploy
vercel
```

Sigue las instrucciones:
- Select scope: Tu cuenta
- Link to existing project: No
- Project name: conexa-frontend
- Directory: `./` (raíz)
- Build command: `npm run build`
- Output directory: `dist`

3. **Variables de Entorno en Vercel**

En el dashboard de Vercel del frontend, agrega:

```
VITE_API_URL=https://tu-backend-url.vercel.app
```

### Opción B: Deploy del Backend a Vercel

1. **Crear `vercel.json` en la carpeta `server/`**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

2. **Deploy el Backend**

```bash
cd server
vercel
```

3. **Configurar Variables de Entorno en Vercel**

En el dashboard de tu proyecto backend en Vercel, ve a **Settings → Environment Variables** y agrega:

```
MONGO_URI=tu_mongo_uri_completo
JWT_SECRET=tu_secreto_jwt_seguro
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
CLIENT_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

4. **Redeploy después de agregar variables**

```bash
vercel --prod
```

### Opción C: Deploy Backend a Railway (Alternativa Recomendada)

Railway es mejor para Node.js con cron jobs:

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio GitHub
3. Selecciona la carpeta `server/`
4. Agrega las variables de entorno desde el dashboard
5. Deploy automático

**Ventaja:** Los cron jobs funcionarán correctamente en Railway (no en Vercel serverless).

## 🔒 Seguridad

### Antes de Subir a GitHub

1. ✅ **Verificar .gitignore** - Ya incluido
2. ✅ **No commitear .env** - Usar .env.example
3. ✅ **Generar JWT_SECRET único**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Variables Sensibles

**NUNCA subas a GitHub:**
- ❌ `.env`
- ❌ Contraseñas
- ❌ API keys
- ❌ Tokens de MongoDB
- ❌ `EMAIL_PASS`

**SÍ sube:**
- ✅ `.env.example` (sin valores reales)
- ✅ Código fuente
- ✅ `package.json`

## 📦 Estructura del Proyecto

```
conexa/
├── src/                    # Frontend (React + Vite)
│   ├── components/        # Componentes reutilizables
│   ├── context/          # Context API (Auth, Cart, Wishlist)
│   ├── pages/            # Páginas de la app
│   └── styles/           # Tailwind CSS
│
├── server/               # Backend (Node.js + Express)
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Utilidades (email, tokens)
│   ├── scripts/         # Scripts de utilidad
│   ├── cron.js          # Tareas programadas
│   └── index.js         # Punto de entrada
│
├── .gitignore           # Archivos a ignorar
├── package.json         # Dependencias frontend
└── README.md            # Este archivo
```

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `PUT /api/auth/profile` - Actualizar perfil

### Products
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle de producto
- `POST /api/products` - Crear (Admin)
- `PUT /api/products/:id` - Actualizar (Admin)
- `DELETE /api/products/:id` - Eliminar (Admin)

### Orders
- `POST /api/orders` - Crear orden
- `GET /api/orders/user/:userId` - Órdenes del usuario
- `PUT /api/orders/:id/pay` - Marcar como pagada
- `PUT /api/orders/:id/status` - Actualizar estado

### Reviews
- `POST /api/reviews/:productId` - Crear reseña
- `GET /api/reviews/:productId` - Obtener reseñas

### Notifications
- `GET /api/user-notifications` - Notificaciones del usuario
- `PUT /api/user-notifications/:id/read` - Marcar como leída

## 🛠️ Scripts Útiles

### Desarrollo

```bash
# Frontend
npm run dev

# Backend
cd server && npm start
```

### Producción

```bash
# Build frontend
npm run build

# Servir frontend estático
npm run preview
```

### Poblar BD

```bash
cd server
node seeder.js
```

### Simular Pago (Testing)

```bash
cd server
node scripts/simulatePayment.js
```

## 📧 Configuración de Emails

Los emails se envían en los siguientes eventos:
- ✉️ Confirmación de orden
- ⏰ Recordatorio de pago (14h después)
- ✅ Confirmación de pago
- ❌ Cancelación de orden

## ⚠️ Limitaciones Conocidas

- No hay pasarela de pago real (solo simulación)
- Cron jobs no funcionan en Vercel (usar Railway o servidor tradicional)
- Subida de imágenes es local (considerar Cloudinary para producción)

## 🚀 Próximos Pasos

- [ ] Integración con Stripe/PayPal
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Panel de analíticas para admin
- [ ] PWA (Progressive Web App)
- [ ] Cloudinary para imágenes

## 📝 Licencia

Proyecto educativo - Uso libre

## 👨‍💻 Autor

**Mauricio Mendoza**
- GitHub: [@Th3Mauryy](https://github.com/Th3Mauryy)

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Revisa que `MONGO_URI` esté correcto

### "Email not sending"
- Verifica que `EMAIL_PASS` sea una contraseña de aplicación, no tu contraseña normal
- Asegúrate de tener 2FA activado en Gmail

### "CORS errors"
- Verifica que `CLIENT_URL` en el backend apunte a tu frontend
- En producción, actualiza la URL en las variables de entorno

### "Cron jobs not working on Vercel"
- Vercel usa serverless functions, los cron jobs no funcionan
- Usa Railway, Render, o Heroku para el backend

---

**¿Necesitas ayuda?** Abre un issue en GitHub.
