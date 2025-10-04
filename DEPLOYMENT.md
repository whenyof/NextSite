# 🚀 Guía de Despliegue - NextSite

## ⚠️ IMPORTANTE: Configuración de API Keys

Antes de subir a GitHub, debes configurar las API keys de forma segura.

## 📋 Pasos para Configurar

### 1. Crear archivo de configuración local

```bash
# Copia el archivo de ejemplo
cp config.example.js config.js
```

### 2. Editar config.js con tus API keys reales

```javascript
window.NextSiteConfig = {
    // EmailJS Configuration
    emailjs: {
        serviceId: "tu_service_id_real",
        templateId: "tu_template_id_real", 
        confirmationTemplateId: "tu_confirmation_template_id_real",
        publicKey: "tu_public_key_real"
    },
    
    // OpenAI Configuration (para el chatbot)
    openai: {
        apiKey: "sk-tu_api_key_real_de_openai", // ⚠️ CLAVE REAL AQUÍ
        apiUrl: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        maxTokens: 150,
        temperature: 0.7
    },
    
    // Stripe Configuration
    stripe: {
        publishableKey: "pk_test_tu_stripe_key_real", // ⚠️ CLAVE REAL AQUÍ
        successUrl: "https://nextsite.es/success.html",
        cancelUrl: "https://nextsite.es/cancel.html",
        currency: "eur"
    },
    
    // PayPal Configuration
    paypal: {
        clientId: "tu_paypal_client_id_real", // ⚠️ CLAVE REAL AQUÍ
        currency: "EUR",
        intent: "capture"
    }
};
```

## 🔒 Seguridad Garantizada

### ✅ Lo que está protegido:

1. **config.js** está en `.gitignore` - NO se sube a Git
2. **Las API keys están ocultas** del código público
3. **Solo se sube config.example.js** con valores vacíos
4. **GitHub no detectará** las claves reales

### ✅ Archivos que SÍ se suben a GitHub:
- `index.html`
- `script-optimized.js`
- `styles.css`
- `chatbot.js`
- `cart.js`
- `payment-integration.js`
- `config.example.js` (con claves vacías)
- `.gitignore`
- `README.md`

### ❌ Archivos que NO se suben a GitHub:
- `config.js` (con claves reales)
- `.env`
- Archivos temporales

## 🚀 Proceso de Despliegue

### 1. Preparar el repositorio

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos EXCEPTO config.js
git add .
git status  # Verificar que config.js NO aparece

# Hacer commit
git commit -m "NextSite website - optimized and secure"

# Subir a GitHub
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

### 2. Desplegar en servidor

1. **Subir archivos al servidor** (todos EXCEPTO config.js)
2. **Crear config.js en el servidor** con las claves reales
3. **Verificar que .htaccess funciona** para optimizaciones
4. **Probar todas las funcionalidades**

## 🧪 Verificación

### ✅ Checklist antes de subir a GitHub:

- [ ] `config.js` NO aparece en `git status`
- [ ] `config.example.js` tiene claves vacías
- [ ] `.gitignore` incluye `config.js`
- [ ] El sitio funciona localmente con `config.js`
- [ ] No hay claves de API en el código público

### ✅ Checklist después del despliegue:

- [ ] El sitio carga correctamente
- [ ] Los formularios envían emails
- [ ] El chatbot responde (si tienes OpenAI)
- [ ] Los pagos funcionan (si tienes Stripe/PayPal)
- [ ] Las optimizaciones de velocidad funcionan

## 🔧 Configuración de Servicios

### EmailJS (Formularios)
1. Ve a [emailjs.com](https://www.emailjs.com/)
2. Crea cuenta gratuita
3. Configura servicio de email (Gmail, Outlook, etc.)
4. Crea templates para formularios
5. Copia los IDs en `config.js`

### OpenAI (Chatbot)
1. Ve a [platform.openai.com](https://platform.openai.com/)
2. Crea cuenta
3. Ve a "API Keys"
4. Genera nueva clave
5. Copia en `config.js`

### Stripe (Pagos)
1. Ve a [stripe.com](https://stripe.com/)
2. Crea cuenta
3. Ve a "Developers" > "API Keys"
4. Copia "Publishable key"
5. Copia en `config.js`

### PayPal (Pagos)
1. Ve a [developer.paypal.com](https://developer.paypal.com/)
2. Crea aplicación
3. Copia "Client ID"
4. Copia en `config.js`

## 🆘 Solución de Problemas

### Error: "API key not found"
- Verifica que `config.js` existe en el servidor
- Verifica que las claves están correctas
- Verifica que no hay espacios extra

### Error: "CORS policy"
- Verifica que estás usando HTTPS en producción
- Verifica que las URLs están configuradas correctamente

### Error: "Email not sending"
- Verifica la configuración de EmailJS
- Verifica que los templates existen
- Verifica que el servicio está activo

## 📞 Soporte

Si tienes problemas:
1. Revisa este archivo
2. Revisa README.md
3. Contacta: info@nextsite.es

---

**🎉 ¡Tu sitio web está listo para ser súper rápido, seguro y profesional!**
