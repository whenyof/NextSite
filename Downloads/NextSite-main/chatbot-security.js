/**
 * Configuración de Seguridad para el Chatbot
 * Protege la API key y maneja errores de forma segura
 */

// Configuración de seguridad
const ChatbotSecurity = {
    // API Key protegida (se obtiene desde config.js)
    get apiKey() {
        return window.NextSiteConfig?.openai?.apiKey || '';
    },
    
    // Configuración de límites para proteger contra abuso
    limits: {
        maxMessagesPerHour: 50,        // Máximo 50 mensajes por hora por usuario
        maxTokensPerRequest: 200,      // Límite de tokens por petición
        cooldownTime: 2000,            // Tiempo entre mensajes (2 segundos)
        maxConversationLength: 20      // Máximo 20 mensajes en el contexto
    },
    
    // Configuración de rate limiting
    rateLimiting: {
        enabled: true,
        windowMs: 60 * 60 * 1000,     // 1 hora
        maxRequests: 100,              // 100 requests por hora
        message: 'Has alcanzado el límite de mensajes. Inténtalo más tarde.'
    },
    
    // Configuración de errores
    errorHandling: {
        showDetailedErrors: false,     // No mostrar errores técnicos al usuario
        fallbackToPredefined: true,    // Usar respuestas predefinidas si falla la API
        logErrors: true                // Registrar errores en consola para debugging
    },
    
    // Configuración de privacidad
    privacy: {
        encryptMessages: false,        // No encriptar mensajes (no necesario para este caso)
        storeUserData: false,          // No almacenar datos de usuario
        anonymizeRequests: true        // Anonimizar requests a la API
    }
};

// Función para validar la API key
function validateApiKey() {
    const key = ChatbotSecurity.apiKey;
    return key && key.startsWith('sk-') && key.length > 20;
}

// Función para aplicar rate limiting
function checkRateLimit(userId = 'default') {
    const now = Date.now();
    const windowStart = now - ChatbotSecurity.rateLimiting.windowMs;
    
    // Obtener historial de requests del usuario
    let userRequests = JSON.parse(localStorage.getItem(`chatbot_requests_${userId}`) || '[]');
    
    // Filtrar requests dentro de la ventana de tiempo
    userRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Verificar límite
    if (userRequests.length >= ChatbotSecurity.rateLimiting.maxRequests) {
        return false; // Límite alcanzado
    }
    
    // Añadir nuevo request
    userRequests.push(now);
    localStorage.setItem(`chatbot_requests_${userId}`, JSON.stringify(userRequests));
    
    return true;
}

// Función para obtener API key de forma segura
function getSecureApiKey() {
    if (!validateApiKey()) {
        console.error('API key inválida');
        return null;
    }
    return ChatbotSecurity.apiKey;
}

// Función para manejar errores de forma segura
function handleApiError(error, userMessage) {
    if (ChatbotSecurity.errorHandling.logErrors) {
        console.error('Chatbot API Error:', error);
    }
    
    // Detectar errores específicos
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return '🔑 Error de autenticación: Verifica que tu API key sea correcta.';
    }
    
    if (error.message.includes('429') || error.message.includes('rate limit')) {
        return '⏱️ Has alcanzado el límite de requests. Espera un momento antes de continuar.';
    }
    
    if (error.message.includes('402') || error.message.includes('insufficient_quota')) {
        return '💳 Sin créditos disponibles. Necesitas añadir créditos a tu cuenta de OpenAI en platform.openai.com';
    }
    
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        return '🔧 Error del servidor de OpenAI. Inténtalo de nuevo en unos minutos.';
    }
    
    if (ChatbotSecurity.errorHandling.showDetailedErrors) {
        return `Error técnico: ${error.message}`;
    }
    
    // Respuesta genérica y amigable
    return 'Lo siento, parece que hay un problema técnico. ¿Podrías intentarlo de nuevo o contactarnos directamente?';
}

// Función para sanitizar mensajes del usuario
function sanitizeUserInput(input) {
    return input
        .trim()
        .substring(0, 500) // Limitar longitud
        .replace(/[<>]/g, '') // Remover caracteres peligrosos
        .replace(/\n{3,}/g, '\n\n'); // Limitar saltos de línea
}

// Función para verificar si el mensaje es apropiado
function isMessageAppropriate(message) {
    const inappropriateWords = [
        // Lista de palabras inapropiadas (puedes personalizar)
        'spam', 'scam', 'phishing'
    ];
    
    const lowerMessage = message.toLowerCase();
    return !inappropriateWords.some(word => lowerMessage.includes(word));
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.ChatbotSecurity = {
        validateApiKey,
        checkRateLimit,
        getSecureApiKey,
        handleApiError,
        sanitizeUserInput,
        isMessageAppropriate,
        config: ChatbotSecurity
    };
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChatbotSecurity,
        validateApiKey,
        checkRateLimit,
        getSecureApiKey,
        handleApiError,
        sanitizeUserInput,
        isMessageAppropriate
    };
}
