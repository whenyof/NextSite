/**
 * Configuración del Chatbot NextSite
 * Personaliza aquí todos los aspectos del chatbot
 */

const ChatbotConfig = {
    // Configuración de la empresa
    company: {
        name: 'NextSite',
        description: 'Especialistas en diseño y desarrollo de sitios web profesionales',
        logo: '', // URL del logo (opcional)
        website: 'https://nextsite.es',
        email: 'info@nextsite.es',
        phone: '+34 600 000 000'
    },

    // Servicios ofrecidos
    services: [
        'Diseño web responsivo',
        'Desarrollo a medida',
        'E-commerce profesional',
        'SEO y marketing digital',
        'Mantenimiento web',
        'Hosting y dominios'
    ],

    // Precios de los planes
    prices: {
        'básico': '€299',
        'profesional': '€599',
        'premium': '€999'
    },

    // Configuración de IA
    ai: {
        // Clave de OpenAI configurada (se obtiene desde config.js)
        get apiKey() {
            return window.NextSiteConfig?.openai?.apiKey || '';
        },
        
        // Configuración de la API
        model: 'gpt-4o-mini', // Modelo más avanzado y económico
        maxTokens: 200,
        temperature: 0.7,
        
        // URL de la API (puedes usar un proxy personalizado)
        apiUrl: 'https://api.openai.com/v1/chat/completions'
    },

    // Personalidad del chatbot
    personality: {
        name: 'Asistente NextSite',
        greeting: '¡Hola! 👋 Soy tu asistente de NextSite. ¿En qué puedo ayudarte hoy?',
        tone: 'amigable y profesional',
        language: 'español'
    },

    // Botones de acción rápida
    quickActions: [
        {
            icon: 'fas fa-cogs',
            text: 'Servicios',
            message: '¿Cuáles son vuestros servicios?'
        },
        {
            icon: 'fas fa-code',
            text: 'Proceso',
            message: '¿Cómo funciona el proceso de desarrollo?'
        },
        {
            icon: 'fas fa-euro-sign',
            text: 'Precios',
            message: '¿Cuánto cuesta un sitio web?'
        },
        {
            icon: 'fas fa-clock',
            text: 'Tiempos',
            message: '¿Cuánto tiempo se tarda en desarrollar un sitio web?'
        }
    ],

    // Respuestas predefinidas (fallback cuando no hay IA)
    responses: {
        services: 'Ofrecemos diseño web profesional, desarrollo a medida, e-commerce, SEO y marketing digital. ¿Te interesa algún servicio específico?',
        prices: 'Tenemos tres planes: Básico (€299), Profesional (€599) y Premium (€999). Cada uno incluye diferentes características. ¿Te gustaría conocer más detalles?',
        process: 'Nuestro proceso es: 1) Consulta inicial, 2) Diseño y aprobación, 3) Desarrollo, 4) Testing y 5) Lanzamiento. ¿Tienes alguna pregunta específica sobre el proceso?',
        time: 'El tiempo de desarrollo varía según el proyecto: sitios básicos (2-3 semanas), proyectos complejos (4-6 semanas). ¿Qué tipo de proyecto tienes en mente?',
        contact: 'Puedes contactarnos por email (info@nextsite.es) o rellenar el formulario de contacto. También puedes llamarnos para una consulta gratuita.',
        default: '¡Excelente pregunta! Nuestro equipo de expertos puede ayudarte con eso. ¿Te gustaría que te pongamos en contacto con un especialista o tienes alguna otra consulta?'
    },

    // Configuración visual
    appearance: {
        primaryColor: '#0a74da',
        secondaryColor: '#0056b3',
        borderRadius: '20px',
        shadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        animation: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },

    // Configuración de comportamiento
    behavior: {
        // Tiempo antes de mostrar notificación (milisegundos)
        notificationDelay: 3000,
        
        // Mostrar notificación en primera visita
        showWelcomeNotification: true,
        
        // Guardar historial en localStorage
        saveHistory: true,
        
        // Máximo de mensajes en el historial
        maxHistoryMessages: 50,
        
        // Auto-scroll al final
        autoScroll: true,
        
        // Tiempo de "escribiendo" simulado (milisegundos)
        typingDelay: 1000
    },

    // Mensajes del sistema
    messages: {
        typing: 'Asistente está escribiendo...',
        online: 'En línea',
        offline: 'Desconectado',
        error: 'Lo siento, parece que hay un problema técnico. ¿Podrías intentarlo de nuevo o contactarnos directamente?',
        placeholder: 'Escribe tu mensaje...',
        send: 'Enviar mensaje'
    },

    // Configuración de accesibilidad
    accessibility: {
        // Texto alternativo para imágenes
        altText: {
            toggle: 'Abrir chat de asistencia',
            minimize: 'Minimizar chat',
            send: 'Enviar mensaje',
            avatar: 'Avatar del asistente'
        },
        
        // Navegación por teclado
        keyboardNavigation: true,
        
        // Anuncios de cambios para lectores de pantalla
        announceMessages: true
    },

    // Configuración de privacidad
    privacy: {
        // Recopilar datos de uso (anónimos)
        collectUsageData: false,
        
        // Mensaje de privacidad
        privacyNotice: 'Este chat puede almacenar temporalmente tu conversación para mejorar el servicio.',
        
        // Mostrar aviso de cookies
        showCookieNotice: false
    }
};

// Exportar configuración para uso global
if (typeof window !== 'undefined') {
    window.ChatbotConfig = ChatbotConfig;
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotConfig;
}
