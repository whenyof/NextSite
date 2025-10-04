/**
 * Sistema de Formulario de Contratación
 * Formulario modal limpio y moderno para todos los planes
 */

class ContratarFormulario {
    constructor() {
        this.config = window.PaymentConfig || {};
        this.init();
    }
    
    init() {
        this.setupButtons();
        this.addStyles();
    }
    
    setupButtons() {
        // Configurar todos los botones "Contratar Ahora"
        const contratarButtons = document.querySelectorAll('.buy-now[data-plan]');
        
        contratarButtons.forEach(button => {
            // Remover cualquier event listener existente
            button.replaceWith(button.cloneNode(true));
            const newButton = document.querySelector(`.buy-now[data-plan="${button.getAttribute('data-plan')}"]`);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const plan = newButton.getAttribute('data-plan');
                const price = newButton.getAttribute('data-price');
                const name = newButton.getAttribute('data-name');
                
                this.showForm(plan, price, name);
            });
        });
        
        console.log('Sistema de contratación configurado');
    }
    
    showForm(plan, price, name) {
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'contratar-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-handshake"></i> Contratar ${name}</h3>
                    <button class="modal-close" onclick="this.closest('.contratar-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="plan-info">
                        <div class="plan-selected">
                            <span class="plan-name">${name}</span>
                            <span class="plan-price">€${price}</span>
                        </div>
                        <p class="plan-description">${this.getPlanDescription(plan)}</p>
                    </div>
                    
                    <form class="contratar-form" id="contratarForm">
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
                            <button type="button" class="btn-cancelar" onclick="this.closest('.contratar-modal').remove()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn-confirmar">
                                <i class="fas fa-credit-card"></i> Confirmar y Pagar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Configurar formulario
        const form = modal.querySelector('#contratarForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e, plan, price, name));
        
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
    
    getPlanDescription(plan) {
        const descriptions = {
            'basico': 'Sitio web profesional con diseño moderno y responsive',
            'profesional': 'Sitio web avanzado con funcionalidades personalizadas',
            'premium': 'Sitio web completo con e-commerce y funcionalidades premium',
            'mantenimiento': 'Servicio de mantenimiento mensual y actualizaciones'
        };
        
        return descriptions[plan.toLowerCase()] || 'Plan personalizado';
    }
    
    handleSubmit(e, plan, price, name) {
        e.preventDefault();
        
        // Validar formulario
        if (!this.validateForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getFormData();
        
        // Mostrar loading
        const submitBtn = e.target.querySelector('.btn-confirmar');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        // Procesar formulario de forma asíncrona
        this.processFormAsync(formData, plan, price, name, submitBtn, originalText);
    }
    
    async processFormAsync(formData, plan, price, name, submitBtn, originalText) {
        try {
            // Enviar información por email
            const emailSent = await this.sendProjectInfo(formData, plan, price, name);
            
            if (emailSent) {
                console.log('✅ Email de contratación enviado correctamente');
                
                // Mostrar mensaje de éxito similar al formulario de contacto
                this.showSuccessMessage();
                
                // Cerrar modal
                const modal = document.querySelector('.contratar-modal');
                if (modal) modal.remove();
                
                // Redirigir a Stripe después de un breve delay
                setTimeout(() => {
                    this.redirectToStripe(plan);
                }, 1000);
                
            } else {
                console.warn('No se pudo enviar el email, pero continuando con el proceso');
                // Redirigir a Stripe de todas formas
                this.redirectToStripe(plan);
            }
            
        } catch (error) {
            console.error('Error al procesar:', error);
            this.showError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        // Usar la misma función de éxito que el formulario de contacto
        if (typeof showSuccessPopup === 'function') {
            showSuccessPopup();
        } else {
            // Fallback si no está disponible
            alert('¡Solicitud recibida! Te hemos enviado un email de confirmación.');
        }
    }
    
    validateForm() {
        const form = document.getElementById('contratarForm');
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
    
    getFormData() {
        const form = document.getElementById('contratarForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    async sendProjectInfo(formData, plan, price, name) {
        // Usar la misma configuración que el formulario de contacto
        try {
            console.log('=== ENVIANDO EMAIL DE CONTRATACIÓN ===');
            
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está cargado');
            }
            
            // Parámetros usando la misma estructura que el formulario de contacto
            const templateParams = {
                from_name: formData.nombre,
                from_company: 'Cliente de Contratación',
                from_email: formData.email,
                from_phone: formData.telefono || 'No especificado',
                plan_interes: name,
                project_description: formData.proyecto,
                delivery_time: 'A definir',
                message: `${name} - ${formData.proyecto}`,
                date: new Date().toLocaleString('es-ES')
            };
            
            console.log('Enviando email de contratación...');
            
            // Usar la misma configuración que el formulario de contacto
            await emailjs.init("Gi9mcTal5Dla_Worb");
            
            const result = await emailjs.send(
                "service_cxiow2d",
                "template_f7i9j0p",
                templateParams
            );
            
            console.log('✅ Email de contratación enviado:', result);
            return true;
            
        } catch (error) {
            console.error('=== ERROR EN ENVÍO DE EMAIL ===');
            console.error('Error:', error);
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);
            console.error('Error message:', error.message);
            return false;
        }
    }
    
    redirectToStripe(plan) {
        // Cerrar modal
        const modal = document.querySelector('.contratar-modal');
        if (modal) modal.remove();
        
        // Obtener enlace de Stripe según el plan
        const paymentLink = this.getPaymentLink(plan);
        
        if (paymentLink && paymentLink !== '#') {
            // Redirigir a Stripe
            window.open(paymentLink, '_blank');
        } else {
            this.showError('Lo siento, este plan no está disponible para pago directo en este momento.');
        }
    }
    
    getPaymentLink(plan) {
        const paymentLinks = {
            'basico': 'https://buy.stripe.com/aFa28r53UcFc0WH27i2cg00',
            'profesional': 'https://buy.stripe.com/7sYbJ1aoedJgbBl9zK2cg02',
            'premium': 'https://buy.stripe.com/4gMcN5gMC34CbBl8vG2cg03',
            'mantenimiento': 'https://buy.stripe.com/14A8wP53U20ycFpbHS2cg01'
        };
        
        return paymentLinks[plan.toLowerCase()] || '#';
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
        
        // Auto-remove después de 7 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 7000);
    }
    
    addStyles() {
        if (document.getElementById('contratar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'contratar-styles';
        styles.textContent = `
            /* Modal de Contratación */
            .contratar-modal {
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
            
            .plan-selected {
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
            
            .contratar-form {
                max-width: 100%;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
                font-size: 0.95rem;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
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
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .form-group textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            .form-group select[disabled] {
                background: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .form-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                margin-top: 30px;
                padding-top: 25px;
                border-top: 2px solid #e9ecef;
            }
            
            .btn-cancelar,
            .btn-confirmar {
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
            
            .btn-cancelar {
                background: #6c757d;
                color: white;
            }
            
            .btn-cancelar:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .btn-confirmar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-confirmar:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            }
            
            .btn-confirmar:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
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
                .modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .modal-header {
                    padding: 20px;
                }
                
                .modal-header h3 {
                    font-size: 1.3rem;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .plan-selected {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .btn-cancelar,
                .btn-confirmar {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.contratarFormulario = new ContratarFormulario();
    console.log('Sistema de contratación inicializado');
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ContratarFormulario = ContratarFormulario;
}