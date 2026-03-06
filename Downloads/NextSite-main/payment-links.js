/**
 * Sistema de Enlaces de Pago - NextSite
 * Enlaces directos y funcionales para todos los planes
 */

class PaymentLinks {
    constructor() {
        this.links = {
            'basico': {
                name: 'Plan Básico',
                price: '299',
                description: 'Sitio web profesional con diseño moderno y responsive',
                stripe: 'https://buy.stripe.com/aFa28r53UcFc0WH27i2cg00',
                paypal: 'https://www.paypal.com/paypalme/nextsite/299',
                direct: 'https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Básico%20(€299)'
            },
            'profesional': {
                name: 'Plan Profesional',
                price: '599',
                description: 'Sitio web avanzado con funcionalidades personalizadas',
                stripe: 'https://buy.stripe.com/7sYbJ1aoedJgbBl9zK2cg02',
                paypal: 'https://www.paypal.com/paypalme/nextsite/599',
                direct: 'https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Profesional%20(€599)'
            },
            'premium': {
                name: 'Plan Premium',
                price: '999',
                description: 'Sitio web completo con e-commerce y funcionalidades premium',
                stripe: 'https://buy.stripe.com/4gMcN5gMC34CbBl8vG2cg03',
                paypal: 'https://www.paypal.com/paypalme/nextsite/999',
                direct: 'https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20Premium%20(€999)'
            },
            'mantenimiento': {
                name: 'Plan de Mantenimiento',
                price: '100',
                description: 'Servicio de mantenimiento mensual y actualizaciones',
                stripe: 'https://buy.stripe.com/14A8wP53U20ycFpbHS2cg01',
                paypal: 'https://www.paypal.com/paypalme/nextsite/100',
                direct: 'https://wa.me/34600000000?text=Hola%2C%20quiero%20contratar%20el%20Plan%20de%20Mantenimiento%20(€100)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupButtons();
        this.testLinks();
    }
    
    setupButtons() {
        // Configurar botones de contratación
        const buttons = document.querySelectorAll('.buy-now[data-plan]');
        
        buttons.forEach(button => {
            // Remover event listeners existentes
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const plan = newButton.getAttribute('data-plan');
                const price = newButton.getAttribute('data-price');
                const name = newButton.getAttribute('data-name');
                
                this.showClientForm(plan, price, name);
            });
        });
        
        console.log('✅ Sistema de enlaces de pago configurado');
    }
    
    showClientForm(plan, price, name) {
        const planInfo = this.links[plan.toLowerCase()];
        
        if (!planInfo) {
            console.error('Plan no encontrado:', plan);
            this.showError('Plan no disponible');
            return;
        }
        
        // Crear modal con formulario del cliente
        const modal = document.createElement('div');
        modal.className = 'client-form-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user"></i> Información del Cliente</h3>
                    <button class="modal-close" onclick="this.closest('.client-form-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="plan-info">
                        <div class="plan-details">
                            <span class="plan-name">${name}</span>
                            <span class="plan-price">€${price}</span>
                        </div>
                        <p class="plan-description">${planInfo.description}</p>
                    </div>
                    
                    <form class="client-form" id="clientForm">
                        <div class="form-group">
                            <label for="nombre">Nombre completo *</label>
                            <input type="text" id="nombre" name="nombre" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono">
                        </div>
                        
                        <div class="form-group">
                            <label for="proyecto">Descripción del proyecto *</label>
                            <textarea id="proyecto" name="proyecto" rows="4" placeholder="Cuéntanos brevemente sobre tu proyecto..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="plan-elegido">Plan seleccionado</label>
                            <select id="plan-elegido" name="plan" disabled>
                                <option value="${plan}">${name} - €${price}</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-cancelar" onclick="this.closest('.client-form-modal').remove()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn-continuar">
                                <i class="fas fa-arrow-right"></i> Continuar al Pago
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar formulario
        const form = modal.querySelector('#clientForm');
        form.addEventListener('submit', (e) => this.handleClientFormSubmit(e, plan, price, name, modal));
        
        // Cerrar con overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Focus en el primer campo
        setTimeout(() => {
            const firstInput = modal.querySelector('input[required]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    async handleClientFormSubmit(e, plan, price, name, modal) {
        e.preventDefault();
        
        // Validar formulario
        if (!this.validateClientForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getClientFormData();
        
        // Mostrar loading
        const submitBtn = e.target.querySelector('.btn-continuar');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        try {
            // Enviar información por email
            const emailSent = await this.sendClientInfo(formData, plan, price, name);
            
            if (emailSent) {
                console.log('✅ Email de información del cliente enviado correctamente');
                
                // Cerrar modal del formulario
                modal.remove();
                
                // Mostrar opciones de pago
                this.showPaymentOptions(plan, price, name, formData);
                
            } else {
                console.warn('No se pudo enviar el email, pero continuando con el proceso');
                // Cerrar modal del formulario
                modal.remove();
                // Mostrar opciones de pago
                this.showPaymentOptions(plan, price, name, formData);
            }
            
        } catch (error) {
            console.error('Error al procesar formulario:', error);
            this.showError('Hubo un error al procesar tu información. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    validateClientForm() {
        const form = document.getElementById('clientForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validar email
        const emailField = form.querySelector('#email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('error');
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showError('Por favor, completa todos los campos obligatorios correctamente.');
        }
        
        return isValid;
    }
    
    getClientFormData() {
        const form = document.getElementById('clientForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    async sendClientInfo(formData, plan, price, name) {
        try {
            console.log('=== ENVIANDO INFORMACIÓN DEL CLIENTE ===');
            
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está cargado');
            }
            
            // Obtener configuración desde config.js
            const emailjsConfig = window.NextSiteConfig?.emailjs || {
                publicKey: "Gi9mcTal5Dla_Worb",
                serviceId: "service_cxiow2d",
                templateId: "template_f7i9j0p"
            };
            
            // Parámetros para el email
            const templateParams = {
                from_name: formData.nombre,
                from_company: 'Cliente de Contratación',
                from_email: formData.email,
                from_phone: formData.telefono || 'No especificado',
                plan_interes: name,
                project_description: formData.proyecto,
                delivery_time: 'A definir',
                message: `NUEVA SOLICITUD DE CONTRATACIÓN - ${name}: ${formData.proyecto}`,
                date: new Date().toLocaleString('es-ES')
            };
            
            console.log('Enviando información del cliente...');
            
            // Usar la configuración desde config.js
            await emailjs.init(emailjsConfig.publicKey);
            
            const result = await emailjs.send(
                emailjsConfig.serviceId,
                emailjsConfig.templateId,
                templateParams
            );
            
            console.log('✅ Información del cliente enviada:', result);
            return true;
            
        } catch (error) {
            console.error('=== ERROR EN ENVÍO DE EMAIL ===');
            console.error('Error:', error);
            return false;
        }
    }
    
    showPaymentOptions(plan, price, name, clientData = null) {
        const planInfo = this.links[plan.toLowerCase()];
        
        if (!planInfo) {
            console.error('Plan no encontrado:', plan);
            this.showError('Plan no disponible');
            return;
        }
        
        // Crear modal de opciones de pago
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-credit-card"></i> ${name}</h3>
                    <button class="modal-close" onclick="this.closest('.payment-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="plan-info">
                        <div class="plan-details">
                            <span class="plan-name">${name}</span>
                            <span class="plan-price">€${price}</span>
                        </div>
                        <p class="plan-description">${planInfo.description}</p>
                    </div>
                    
                    <div class="payment-options">
                        <h4>Elige tu método de pago:</h4>
                        
                        <div class="payment-method">
                            <button class="payment-btn stripe-btn" onclick="window.paymentLinks.payWithStripe('${plan}')">
                                <i class="fab fa-stripe"></i>
                                <span>Pagar con Stripe</span>
                                <small>Tarjeta de crédito/débito</small>
                            </button>
                        </div>
                        
                        <div class="payment-method">
                            <button class="payment-btn paypal-btn" onclick="window.paymentLinks.payWithPayPal('${plan}')">
                                <i class="fab fa-paypal"></i>
                                <span>Pagar con PayPal</span>
                                <small>PayPal o tarjeta</small>
                            </button>
                        </div>
                        
                        <div class="payment-method">
                            <button class="payment-btn whatsapp-btn" onclick="window.paymentLinks.payWithWhatsApp('${plan}')">
                                <i class="fab fa-whatsapp"></i>
                                <span>Contactar por WhatsApp</span>
                                <small>Pago directo o consulta</small>
                            </button>
                        </div>
                    </div>
                    
                    <div class="payment-footer">
                        <p class="security-note">
                            <i class="fas fa-shield-alt"></i>
                            Todos los pagos son seguros y están protegidos
                        </p>
                        <button class="btn-cancel" onclick="this.closest('.payment-modal').remove()">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar con overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    payWithStripe(plan) {
        const planInfo = this.links[plan.toLowerCase()];
        
        if (!planInfo) {
            this.showError('Plan no disponible');
            return;
        }
        
        // Cerrar modal
        const modal = document.querySelector('.payment-modal');
        if (modal) modal.remove();
        
        // Abrir enlace de Stripe
        if (planInfo.stripe && planInfo.stripe !== '#') {
            window.open(planInfo.stripe, '_blank');
        } else {
            this.showError('Enlace de Stripe no disponible. Usa WhatsApp para contactarnos.');
            setTimeout(() => {
                this.payWithWhatsApp(plan);
            }, 2000);
        }
    }
    
    payWithPayPal(plan) {
        const planInfo = this.links[plan.toLowerCase()];
        
        if (!planInfo) {
            this.showError('Plan no disponible');
            return;
        }
        
        // Cerrar modal
        const modal = document.querySelector('.payment-modal');
        if (modal) modal.remove();
        
        // Abrir enlace de PayPal
        if (planInfo.paypal && planInfo.paypal !== '#') {
            window.open(planInfo.paypal, '_blank');
        } else {
            this.showError('Enlace de PayPal no disponible. Usa WhatsApp para contactarnos.');
            setTimeout(() => {
                this.payWithWhatsApp(plan);
            }, 2000);
        }
    }
    
    payWithWhatsApp(plan) {
        const planInfo = this.links[plan.toLowerCase()];
        
        if (!planInfo) {
            this.showError('Plan no disponible');
            return;
        }
        
        // Cerrar modal
        const modal = document.querySelector('.payment-modal');
        if (modal) modal.remove();
        
        // Abrir WhatsApp
        if (planInfo.direct && planInfo.direct !== '#') {
            window.open(planInfo.direct, '_blank');
        } else {
            this.showError('Enlace de WhatsApp no disponible');
        }
    }
    
    async testLinks() {
        // Probar enlaces de Stripe
        console.log('🔍 Probando enlaces de pago...');
        
        for (const [plan, info] of Object.entries(this.links)) {
            console.log(`📋 ${info.name}:`);
            console.log(`   Stripe: ${info.stripe}`);
            console.log(`   PayPal: ${info.paypal}`);
            console.log(`   WhatsApp: ${info.direct}`);
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="error-close" onclick="this.closest('.error-message').remove()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    addStyles() {
        if (document.getElementById('payment-links-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'payment-links-styles';
        styles.textContent = `
            /* Modal de Formulario del Cliente */
            .client-form-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .client-form-modal .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideInUp 0.3s ease-out;
            }
            
            .client-form-modal .modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .client-form-modal .modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .client-form-modal .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            
            .client-form-modal .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .client-form-modal .modal-body {
                padding: 30px;
            }
            
            .client-form-modal .plan-info {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: center;
            }
            
            .client-form-modal .plan-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .client-form-modal .plan-name {
                font-size: 1.2rem;
                font-weight: 600;
                color: #333;
            }
            
            .client-form-modal .plan-price {
                font-size: 1.5rem;
                font-weight: bold;
                color: #28a745;
            }
            
            .client-form-modal .plan-description {
                margin: 0;
                color: #666;
                font-size: 0.95rem;
            }
            
            .client-form {
                max-width: 100%;
            }
            
            .client-form .form-group {
                margin-bottom: 20px;
            }
            
            .client-form .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
                font-size: 0.95rem;
            }
            
            .client-form .form-group input,
            .client-form .form-group select,
            .client-form .form-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
                box-sizing: border-box;
                font-family: inherit;
            }
            
            .client-form .form-group input:focus,
            .client-form .form-group select:focus,
            .client-form .form-group textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .client-form .form-group input.error,
            .client-form .form-group select.error,
            .client-form .form-group textarea.error {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .client-form .form-group textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            .client-form .form-group select[disabled] {
                background: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .client-form .form-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                margin-top: 30px;
                padding-top: 25px;
                border-top: 2px solid #e9ecef;
            }
            
            .client-form .btn-cancelar,
            .client-form .btn-continuar {
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .client-form .btn-cancelar {
                background: #6c757d;
                color: white;
            }
            
            .client-form .btn-cancelar:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .client-form .btn-continuar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .client-form .btn-continuar:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            }
            
            .client-form .btn-continuar:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            /* Modal de Opciones de Pago */
            .payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideInUp 0.3s ease-out;
            }
            
            .modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .plan-info {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: center;
            }
            
            .plan-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .plan-name {
                font-size: 1.2rem;
                font-weight: 600;
                color: #333;
            }
            
            .plan-price {
                font-size: 1.5rem;
                font-weight: bold;
                color: #28a745;
            }
            
            .plan-description {
                margin: 0;
                color: #666;
                font-size: 0.95rem;
            }
            
            .payment-options h4 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.1rem;
                text-align: center;
            }
            
            .payment-method {
                margin-bottom: 15px;
            }
            
            .payment-btn {
                width: 100%;
                padding: 20px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                color: white;
            }
            
            .stripe-btn {
                background: linear-gradient(135deg, #635bff 0%, #00d4aa 100%);
            }
            
            .stripe-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(99, 91, 255, 0.4);
            }
            
            .paypal-btn {
                background: linear-gradient(135deg, #0070ba 0%, #009cde 100%);
            }
            
            .paypal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 112, 186, 0.4);
            }
            
            .whatsapp-btn {
                background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            }
            
            .whatsapp-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
            }
            
            .payment-btn i {
                font-size: 1.5rem;
            }
            
            .payment-btn small {
                font-size: 0.85rem;
                opacity: 0.9;
                font-weight: 400;
            }
            
            .payment-footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                text-align: center;
            }
            
            .security-note {
                margin: 0 0 20px 0;
                color: #666;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .security-note i {
                color: #28a745;
            }
            
            .btn-cancel {
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.3s;
            }
            
            .btn-cancel:hover {
                background: #5a6268;
            }
            
            /* Mensaje de Error */
            .error-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                animation: slideInUp 0.3s ease-out;
            }
            
            .error-content .error-icon {
                font-size: 3rem;
                color: #dc3545;
                margin-bottom: 20px;
            }
            
            .error-content h3 {
                margin: 0 0 15px 0;
                color: #333;
            }
            
            .error-content p {
                margin: 0 0 20px 0;
                color: #666;
                line-height: 1.5;
            }
            
            .error-close {
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0 auto;
            }
            
            .error-close:hover {
                background: #c82333;
            }
            
            /* Animaciones */
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .client-form-modal .modal-content,
                .payment-modal .modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .client-form-modal .modal-header,
                .payment-modal .modal-header {
                    padding: 20px;
                }
                
                .client-form-modal .modal-header h3,
                .payment-modal .modal-header h3 {
                    font-size: 1.3rem;
                }
                
                .client-form-modal .modal-body,
                .payment-modal .modal-body {
                    padding: 20px;
                }
                
                .client-form-modal .plan-details,
                .payment-modal .plan-details {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }
                
                .client-form .form-actions {
                    flex-direction: column;
                }
                
                .client-form .btn-cancelar,
                .client-form .btn-continuar {
                    width: 100%;
                    justify-content: center;
                }
                
                .payment-btn {
                    padding: 18px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.paymentLinks = new PaymentLinks();
    window.paymentLinks.addStyles();
    console.log('✅ Sistema de enlaces de pago inicializado');
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PaymentLinks = PaymentLinks;
}
