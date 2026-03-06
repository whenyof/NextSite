# NextSite - Sitio Web Profesional

Sitio web optimizado para empresas que buscan presencia digital profesional.

## 🚀 Características

- ✅ Diseño responsive y moderno
- ✅ Chatbot con IA (OpenAI GPT)
- ✅ Sistema de pagos (Stripe, PayPal)
- ✅ Formularios de contacto optimizados
- ✅ SEO optimizado
- ✅ Velocidad de carga optimizada
- ✅ Seguridad mejorada

## ⚙️ Configuración

### 1. Configurar API Keys

1. Copia el archivo de ejemplo:
```bash
cp config.example.js config.js
```

2. Edita `config.js` y agrega tus API keys:

```javascript
window.NextSiteConfig = {
    // EmailJS Configuration
    emailjs: {
        serviceId: "tu_service_id_de_emailjs",
        templateId: "tu_template_id_de_emailjs",
        confirmationTemplateId: "tu_confirmation_template_id",
        publicKey: "tu_public_key_de_emailjs"
    },
    
    // OpenAI Configuration (para el chatbot)
    openai: {
        apiKey: "tu_api_key_de_openai", // Agrega tu clave de OpenAI aquí
        // ... resto de configuración
    },
    
    // Stripe Configuration
    stripe: {
        publishableKey: "tu_stripe_publishable_key",
        // ... resto de configuración
    },
    
    // PayPal Configuration
    paypal: {
        clientId: "tu_paypal_client_id",
        // ... resto de configuración
    }
};
```

### 2. Servicios Necesarios

#### EmailJS (Formularios de contacto)
1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Configura tu servicio de email
4. Crea templates para formularios
5. Copia los IDs en `config.js`

#### OpenAI (Chatbot)
1. Ve a [OpenAI](https://platform.openai.com/)
2. Crea una cuenta
3. Genera una API key
4. Agrega la key en `config.js`

#### Stripe (Pagos)
1. Ve a [Stripe](https://stripe.com/)
2. Crea una cuenta
3. Obtén tu publishable key
4. Agrega la key en `config.js`

#### PayPal (Pagos)
1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Crea una aplicación
3. Obtén tu client ID
4. Agrega el ID en `config.js`

## 📁 Estructura del Proyecto

```
nextsite/
├── index.html              # Página principal
├── config.js              # Configuración (NO subir a Git)
├── config.example.js      # Ejemplo de configuración
├── script-optimized.js    # JavaScript optimizado
├── styles.css             # Estilos principales
├── chatbot.js             # Sistema de chatbot
├── cart.js                # Sistema de carrito
├── payment-integration.js # Integración de pagos
├── data.json              # Datos estáticos
├── .htaccess              # Configuración del servidor
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Este archivo
```

## 🔒 Seguridad

- ✅ `config.js` está en `.gitignore` - NO se sube a Git
- ✅ Las API keys están protegidas
- ✅ Headers de seguridad configurados
- ✅ Validación de entrada en formularios

## 🚀 Despliegue

1. **Subir a GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Desplegar en servidor:**
- Sube todos los archivos EXCEPTO `config.js`
- Crea `config.js` en el servidor con tus API keys reales
- Configura el servidor web (Apache/Nginx)

## 📱 Funcionalidades

### Chatbot Inteligente
- Respuestas automáticas con IA
- Configuración personalizable
- Fallback cuando no hay conexión

### Sistema de Pagos
- Múltiples métodos de pago
- Integración con Stripe y PayPal
- Carrito de compras funcional

### Formularios Optimizados
- Validación en tiempo real
- Envío automático por email
- Confirmación al usuario

### SEO y Rendimiento
- Meta tags optimizados
- Imágenes optimizadas
- Carga rápida
- Mobile-first design

## 🛠️ Desarrollo

### Modificar el sitio:
1. Edita `index.html` para cambios en estructura
2. Edita `styles.css` para cambios visuales
3. Edita `script-optimized.js` para funcionalidad
4. Usa `data.json` para contenido dinámico

### Agregar nuevas funcionalidades:
1. Crea el código en archivos separados
2. Incluye en `index.html`
3. Actualiza `config.js` si necesitas nuevas API keys

## 📞 Soporte

Para soporte técnico o consultas:
- Email: info@nextsite.es
- Sitio web: https://nextsite.es

## 📄 Licencia

Este proyecto es propiedad de NextSite. Todos los derechos reservados.

---

**⚠️ Importante:** Nunca subas `config.js` a Git. Siempre usa `config.example.js` como plantilla.
