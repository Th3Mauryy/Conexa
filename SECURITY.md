# 🔒 Configuración Segura de Variables de Entorno

## ⚠️ IMPORTANTE: NUNCA expongas credenciales reales en el código

Este proyecto requiere credenciales de PayPal y Twilio que NUNCA deben incluirse en el código fuente.

## 📋 Variables Requeridas

### PayPal (CRÍTICO)

**Obtén TUS PROPIAS credenciales:**

1. Ir a https://developer.paypal.com/dashboard
2. Login con tu cuenta PayPal  
3. Apps & Credentials → Create App
4. Copiar Client ID y Secret
5. Agregar en Vercel:

```
PAYPAL_CLIENT_ID=tu_client_id_de_paypal
PAYPAL_CLIENT_SECRET=tu_secret_de_paypal
PAYPAL_MODE=sandbox
```

### Twilio (Opcional - WhatsApp)

1. Crear cuenta en https://www.twilio.com/try-twilio
2. Copiar del Dashboard: Account SID y Auth Token
3. Agregar en Vercel:

```
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

## 🚀 Configurar en Vercel

1. Dashboard → Settings → Environment Variables
2. Agregar cada variable una por una
3. Seleccionar environments: Production, Preview, Development
4. Save
5. Redeploy

## ⛔ NO HACER:

- ❌ NO incluir credenciales en el código
- ❌ NO commitear archivos .env
- ❌ NO compartir credenciales en documentación pública
- ❌ NO usar credenciales de ejemplo/prueba en producción

## ✅ HACER:

- ✅ Usar variables de entorno
- ✅ Mantener .env en .gitignore
- ✅ Usar credenciales Sandbox para desarrollo
- ✅ Cambiar a credenciales Live para producción
- ✅ Rotar credenciales si se exponen accidentalmente

## 🔄 Si Expusiste Credenciales

1. Revocarlas INMEDIATAMENTE en PayPal/Twilio dashboard
2. Generar nuevas credenciales
3. Actualizar en Vercel
4. NO usar las credenciales expuestas nunca más
