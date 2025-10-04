// NextSite Configuration Example
// Copy this file to config.js and add your actual API keys
// config.js is in .gitignore and will not be committed to Git

window.NextSiteConfig = {
    // EmailJS Configuration
    emailjs: {
        serviceId: "your_emailjs_service_id",
        templateId: "your_emailjs_template_id", 
        confirmationTemplateId: "your_confirmation_template_id",
        publicKey: "your_emailjs_public_key"
    },
    
    // OpenAI Configuration (for chatbot)
    openai: {
        apiKey: "your_openai_api_key_here", // Add your OpenAI API key here
        apiUrl: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        maxTokens: 150,
        temperature: 0.7
    },
    
    // Stripe Configuration
    stripe: {
        publishableKey: "your_stripe_publishable_key", // Add your Stripe publishable key here
        successUrl: "https://nextsite.es/success.html",
        cancelUrl: "https://nextsite.es/cancel.html",
        currency: "eur"
    },
    
    // PayPal Configuration
    paypal: {
        clientId: "your_paypal_client_id", // Add your PayPal client ID here
        currency: "EUR",
        intent: "capture"
    },
    
    // Company Information
    company: {
        name: "NextSite",
        email: "info@nextsite.es",
        website: "https://nextsite.es",
        description: "Diseño web profesional, desarrollo web a medida y optimización SEO para empresas"
    },
    
    // Security Settings
    security: {
        enableHttpsCheck: true,
        enableRateLimit: true,
        maxRequestsPerMinute: 10
    }
};
