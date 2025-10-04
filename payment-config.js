// Payment Configuration
const PaymentConfig = {
    // PayPal Configuration
    paypal: {
        clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal client ID
        environment: 'sandbox', // 'sandbox' for testing, 'production' for live
        currency: 'EUR',
        locale: 'es_ES'
    },
    
    // Stripe Configuration - Enlaces Directos de Pago
    stripe: {
        publishableKey: 'pk_live_51SEDKpH8xs0V1uYpZwhxn0ja1cpjGuU4MoHnTAxQrTdMZRCVRfWuCH4UCc4Rb17O06odulDE4nFJrPKc7emGbM0B00I7tUhSp6', // Clave pública configurada
        currency: 'eur',
        
        // Enlaces directos de pago por plan
        paymentLinks: {
            'basico': 'https://buy.stripe.com/aFa28r53UcFc0WH27i2cg00', // Plan Básico
            'profesional': '', // Añadir cuando tengas el enlace
            'premium': '', // Añadir cuando tengas el enlace
            'mantenimiento': '' // Añadir cuando tengas el enlace
        }
    },
    
    // Apple Pay Configuration
    applePay: {
        merchantId: 'merchant.com.nextsite', // Replace with your Apple Merchant ID
        countryCode: 'ES',
        currencyCode: 'EUR',
        supportedNetworks: ['visa', 'masterCard', 'amex']
    },
    
    // Google Pay Configuration
    googlePay: {
        environment: 'TEST', // 'TEST' for testing, 'PRODUCTION' for live
        merchantId: '12345678901234567890', // Replace with your Google Merchant ID
        merchantName: 'NextSite',
        currencyCode: 'EUR',
        countryCode: 'ES'
    },
    
    // Tax Configuration
    tax: {
        rate: 0.21, // 21% IVA for Spain
        country: 'ES',
        included: true // IVA is included in prices
    },
    
    // Email Configuration for order confirmations (misma config que formulario de contacto)
    email: {
        serviceId: 'service_cxiow2d', // Mismo service ID que formulario de contacto
        templateId: 'template_f7i9j0p', // Mismo template ID que formulario de contacto
        publicKey: 'Gi9mcTal5Dla_Worb' // Misma public key que formulario de contacto
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentConfig;
} else {
    window.PaymentConfig = PaymentConfig;
}
