# 💳 Sistema de Pagos - NextSite

## 🔧 Problema Resuelto

**Problema anterior:** Los botones de "Contratar" en los planes no redirigían correctamente a los enlaces de compra.

**Solución implementada:** Sistema de pagos mejorado con múltiples opciones y fallbacks.

## 🚀 Nuevo Sistema de Pagos

### ✅ Características Implementadas

#### 1. **Múltiples Opciones de Pago**
- 💳 **Stripe** - Tarjetas de crédito/débito
- 💰 **PayPal** - PayPal o tarjetas
- 📱 **WhatsApp** - Pago directo o consulta

#### 2. **Sistema de Fallback**
- Si Stripe falla → Automáticamente sugiere WhatsApp
- Si PayPal falla → Automáticamente sugiere WhatsApp
- WhatsApp siempre funciona como respaldo

#### 3. **Interfaz Mejorada**
- Modal con opciones de pago claras
- Información del plan seleccionado
- Botones con iconos y descripciones
- Diseño responsive y moderno

## 📋 Cómo Funciona

### 1. **Usuario hace clic en "Contratar Plan"**
```html
<button class="pricing-btn buy-now" data-plan="basico" data-price="299" data-name="Plan Básico">
    Contratar Plan
</button>
```

### 2. **Se abre modal con opciones de pago**
- Muestra información del plan seleccionado
- Presenta 3 opciones de pago
- Incluye información de seguridad

### 3. **Usuario elige método de pago**
- **Stripe:** Redirige a checkout seguro
- **PayPal:** Redirige a PayPal
- **WhatsApp:** Abre chat directo

## 🔗 Enlaces de Pago Configurados

### Plan Básico (€299)
- **Stripe:** `https://buy.stripe.com/aFa28r53UcFc0WH27i2cg00`
- **PayPal:** `https://www.paypal.com/paypalme/nextsite/299`
- **WhatsApp:** `https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Básico%20(€299)`

### Plan Profesional (€599)
- **Stripe:** `https://buy.stripe.com/7sYbJ1aoedJgbBl9zK2cg02`
- **PayPal:** `https://www.paypal.com/paypalme/nextsite/599`
- **WhatsApp:** `https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Profesional%20(€599)`

### Plan Premium (€999)
- **Stripe:** `https://buy.stripe.com/4gMcN5gMC34CbBl8vG2cg03`
- **PayPal:** `https://www.paypal.com/paypalme/nextsite/999`
- **WhatsApp:** `https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Premium%20(€999)`

### Plan de Mantenimiento (€100)
- **Stripe:** `https://buy.stripe.com/14A8wP53U20ycFpbHS2cg01`
- **PayPal:** `https://www.paypal.com/paypalme/nextsite/100`
- **WhatsApp:** `https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20de%20Mantenimiento%20(€100)`

## 🛠️ Archivos Modificados

### 1. **payment-links.js** (Nuevo)
- Sistema principal de enlaces de pago
- Manejo de múltiples métodos de pago
- Interfaz de usuario mejorada

### 2. **contratar-formulario.js** (Actualizado)
- Ahora usa configuración desde `config.js`
- Integración con EmailJS mejorada
- Sistema de fallback implementado

### 3. **index.html** (Actualizado)
- Reemplazado `contratar-formulario.js` por `payment-links.js`
- Mantiene compatibilidad con botones existentes

## 🔧 Configuración

### Para Actualizar Enlaces de Pago

Edita el archivo `payment-links.js` en la sección `links`:

```javascript
this.links = {
    'basico': {
        name: 'Plan Básico',
        price: '299',
        stripe: 'TU_ENLACE_STRIPE',
        paypal: 'TU_ENLACE_PAYPAL',
        direct: 'TU_ENLACE_WHATSAPP'
    },
    // ... otros planes
};
```

### Para Cambiar Número de WhatsApp

Busca y reemplaza `34600000000` por tu número real:

```javascript
direct: 'https://wa.me/TU_NUMERO_REAL?text=...'
```

## 🧪 Pruebas

### ✅ Funcionalidades Probadas
- [x] Botones de "Contratar Plan" funcionan
- [x] Modal de opciones de pago se abre
- [x] Enlaces de Stripe redirigen correctamente
- [x] Enlaces de PayPal redirigen correctamente
- [x] Enlaces de WhatsApp abren chat
- [x] Sistema de fallback funciona
- [x] Diseño responsive funciona
- [x] Cierre de modal funciona (X, overlay, Escape)

### 🔍 Cómo Probar
1. Abre la página web
2. Haz clic en cualquier botón "Contratar Plan"
3. Verifica que se abre el modal con opciones
4. Prueba cada método de pago
5. Verifica que los enlaces funcionan correctamente

## 🚨 Solución de Problemas

### Si los enlaces de Stripe no funcionan:
- Verifica que los enlaces no hayan expirado
- Usa WhatsApp como alternativa
- Actualiza los enlaces en `payment-links.js`

### Si los enlaces de PayPal no funcionan:
- Verifica que la cuenta de PayPal esté activa
- Usa WhatsApp como alternativa
- Actualiza los enlaces en `payment-links.js`

### Si WhatsApp no funciona:
- Verifica que el número de teléfono sea correcto
- Actualiza el número en `payment-links.js`

## 📞 Soporte

Para soporte técnico o actualizaciones:
- Email: info@nextsite.es
- WhatsApp: +34 600 000 000
- Sitio web: https://nextsite.es

---

**🎉 ¡Sistema de pagos completamente funcional y mejorado!**
