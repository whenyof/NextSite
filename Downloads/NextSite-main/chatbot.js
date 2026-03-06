/**
 * NextSite Professional Chatbot
 * Advanced AI-powered chat widget with natural conversation
 */

class NextSiteChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        
        // Get configuration from secure config file
        const config = window.NextSiteConfig || {};
        
        this.config = {
            apiKey: config.openai?.apiKey || '',
            apiUrl: config.openai?.apiUrl || 'https://api.openai.com/v1/chat/completions',
            model: config.openai?.model || 'gpt-3.5-turbo',
            maxTokens: config.openai?.maxTokens || 150,
            temperature: config.openai?.temperature || 0.7,
            companyName: config.company?.name || 'NextSite',
            companyDescription: config.company?.description || 'Especialistas en diseño y desarrollo de sitios web profesionales',
            services: [
                'Diseño web responsivo',
                'Desarrollo a medida',
                'E-commerce',
                'SEO y marketing digital',
                'Mantenimiento web'
            ],
            prices: {
                'básico': '€299',
                'profesional': '€599',
                'premium': '€999'
            }
        };
        
        this.systemPrompt = `Eres un asistente virtual profesional de ${this.config.companyName}, especializado en desarrollo web. 

${this.config.companyDescription}. Ofrecemos: ${this.config.services.join(', ')}.

RESPONDE SIEMPRE EN ESPAÑOL con un tono:
- Amigable y profesional
- Conversacional y natural
- Útil y específico
- Breve pero completo (máximo 2-3 frases)

Si preguntan por precios, menciona nuestros planes:
- Plan Básico: ${this.config.prices.básico}
- Plan Profesional: ${this.config.prices.profesional}  
- Plan Premium: ${this.config.prices.premium}

Si no sabes algo específico, ofrece contactar con el equipo.`;

        this.initializeElements();
        this.initializeEventListeners();
        this.loadChatHistory();
        this.showWelcomeNotification();
    }

    initializeElements() {
        this.widget = document.getElementById('chatbot-widget');
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.minimizeBtn = document.getElementById('chatbot-minimize');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.notificationDot = document.getElementById('notification-dot');
        this.quickActions = document.querySelectorAll('.quick-action-btn');
    }

    initializeEventListeners() {
        // Toggle chat
        this.toggle.addEventListener('click', () => this.toggleChat());
        
        // Minimize chat
        this.minimizeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick actions
        this.quickActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.input.value = message;
                this.sendMessage();
            });
        });

        // Hide quick actions after first message
        this.input.addEventListener('input', () => {
            if (this.messageHistory.length > 0) {
                document.querySelector('.quick-actions').style.display = 'none';
            }
        });

        // Auto-resize input
        this.input.addEventListener('input', this.autoResizeInput.bind(this));
    }

    toggleChat() {
        this.isOpen ? this.closeChat() : this.openChat();
    }

    openChat() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.toggle.classList.add('active');
        this.hideNotification();
        this.input.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.isOpen = false;
        this.window.classList.remove('active');
        this.toggle.classList.remove('active');
    }

    showWelcomeNotification() {
        // Show notification after 3 seconds if chat hasn't been opened
        setTimeout(() => {
            if (!this.isOpen && this.messageHistory.length === 0) {
                this.showNotification();
            }
        }, 3000);
    }

    showNotification() {
        this.notificationDot.classList.add('show');
    }

    hideNotification() {
        this.notificationDot.classList.remove('show');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        this.autoResizeInput();

        // Hide quick actions
        document.querySelector('.quick-actions').style.display = 'none';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('Lo siento, parece que hay un problema técnico. ¿Podrías intentarlo de nuevo o contactarnos directamente?', 'bot');
        } finally {
            this.hideTypingIndicator();
        }
    }

    async getAIResponse(message) {
        // Verificar seguridad y límites
        if (window.ChatbotSecurity) {
            // Sanitizar entrada del usuario
            message = window.ChatbotSecurity.sanitizeUserInput(message);
            
            // Verificar si el mensaje es apropiado
            if (!window.ChatbotSecurity.isMessageAppropriate(message)) {
                return 'Lo siento, no puedo responder a ese tipo de mensajes. ¿Hay algo más en lo que pueda ayudarte?';
            }
            
            // Verificar rate limiting
            if (!window.ChatbotSecurity.checkRateLimit()) {
                return 'Has enviado muchos mensajes. Por favor, espera un momento antes de continuar.';
            }
        }

        // Obtener API key de forma segura desde configuración
        const apiKey = this.config.apiKey;

        if (!apiKey) {
            return this.getFallbackResponse(message);
        }

        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...this.messageHistory.slice(-10), // Last 10 messages for context
                        { role: 'user', content: message }
                    ],
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('API Error:', error);
            
            // Manejar errores de forma segura
            if (window.ChatbotSecurity) {
                return window.ChatbotSecurity.handleApiError(error, message);
            }
            
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Service-related responses
        if (lowerMessage.includes('servicio') || lowerMessage.includes('que haces') || lowerMessage.includes('que ofreces')) {
            return 'Ofrecemos diseño web profesional, desarrollo a medida, e-commerce, SEO y marketing digital. ¿Te interesa algún servicio específico?';
        }
        
        // Price-related responses
        if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('euro')) {
            return 'Tenemos tres planes: Básico (€299), Profesional (€599) y Premium (€999). Cada uno incluye diferentes características. ¿Te gustaría conocer más detalles?';
        }
        
        // Process-related responses
        if (lowerMessage.includes('proceso') || lowerMessage.includes('como funciona') || lowerMessage.includes('desarrollo')) {
            return 'Nuestro proceso es: 1) Consulta inicial, 2) Diseño y aprobación, 3) Desarrollo, 4) Testing y 5) Lanzamiento. ¿Tienes alguna pregunta específica sobre el proceso?';
        }
        
        // Time-related responses
        if (lowerMessage.includes('tiempo') || lowerMessage.includes('cuanto tarda') || lowerMessage.includes('duracion')) {
            return 'El tiempo de desarrollo varía según el proyecto: sitios básicos (2-3 semanas), proyectos complejos (4-6 semanas). ¿Qué tipo de proyecto tienes en mente?';
        }
        
        // Contact-related responses
        if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('email')) {
            return 'Puedes contactarnos por email (info@nextsite.es) o rellenar el formulario de contacto. También puedes llamarnos para una consulta gratuita.';
        }
        
        // Default response
        return '¡Excelente pregunta! Nuestro equipo de expertos puede ayudarte con eso. ¿Te gustaría que te pongamos en contacto con un especialista o tienes alguna otra consulta?';
    }

    addMessage(content, sender) {
        const message = {
            content,
            sender,
            timestamp: new Date().toISOString()
        };

        this.messageHistory.push(message);
        this.saveChatHistory();

        // Create message element
        const messageEl = this.createMessageElement(content, sender);
        this.messages.appendChild(messageEl);
        
        // Scroll to bottom
        this.scrollToBottom();

        // Remove welcome message if it exists
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.style.display = 'none';
        }
    }

    createMessageElement(content, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = `<p>${this.formatMessage(content)}</p>`;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = this.formatTime(new Date());
        
        messageContent.appendChild(bubble);
        messageContent.appendChild(time);
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(messageContent);
        
        return messageEl;
    }

    formatMessage(content) {
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Ahora';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `Hace ${minutes} min`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `Hace ${hours}h`;
        } else {
            return date.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
            });
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.sendBtn.disabled = true;
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.sendBtn.disabled = false;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }

    autoResizeInput() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
    }

    saveChatHistory() {
        try {
            localStorage.setItem('nextsite-chat-history', JSON.stringify(this.messageHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('nextsite-chat-history');
            if (saved) {
                this.messageHistory = JSON.parse(saved);
                this.renderChatHistory();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.messageHistory = [];
        }
    }

    renderChatHistory() {
        // Clear current messages except welcome message
        const messages = this.messages.querySelectorAll('.message:not(.welcome-message)');
        messages.forEach(msg => msg.remove());

        // Hide quick actions if there's history
        if (this.messageHistory.length > 0) {
            document.querySelector('.quick-actions').style.display = 'none';
        }

        // Render history
        this.messageHistory.forEach(msg => {
            const messageEl = this.createMessageElement(msg.content, msg.sender);
            this.messages.appendChild(messageEl);
        });

        this.scrollToBottom();
    }

    // Public method to configure API key
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
    }

    // Public method to update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Public method to clear chat history
    clearHistory() {
        this.messageHistory = [];
        localStorage.removeItem('nextsite-chat-history');
        location.reload();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nextSiteChatbot = new NextSiteChatbot();
    
    // Example: Configure API key (replace with your actual key)
    // window.nextSiteChatbot.setApiKey('your-openai-api-key-here');
    
    // Example: Update configuration
    // window.nextSiteChatbot.updateConfig({
    //     companyName: 'Tu Empresa',
    //     companyDescription: 'Tu descripción personalizada'
    // });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NextSiteChatbot;
}
