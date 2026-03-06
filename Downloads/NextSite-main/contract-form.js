/**
 * Sistema de Contratación por Plan
 * Maneja el formulario de contratación y redirección a Stripe
 */

class ContractForm {
    constructor() {
        this.modal = document.getElementById('contractFormModal');
        this.form = document.getElementById('contractForm');
        this.currentPlan = null;
        this.config = window.PaymentConfig || {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupPlanButtons();
    }
    
    setupEventListeners() {
        // Cerrar modal
        const closeBtn = document.getElementById('closeContractModal');
        const cancelBtn = document.getElementById('cancelContract');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Cerrar con overlay
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                    this.closeModal();
                }
            });
        }
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'flex') {
                this.closeModal();
            }
        });
        
        // Envío del formulario
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    setupPlanButtons() {
        // Configurar botones "Contratar Ahora"
        const buyButtons = document.querySelectorAll('.buy-now');
        
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = button.getAttribute('data-plan');
                const price = button.getAttribute('data-price');
                const name = button.getAttribute('data-name');
                
                this.openContractForm(plan, price, name);
            });
        });
    }
    
    openContractForm(plan, price, name) {
        this.currentPlan = { plan, price, name };
        
        // Actualizar información del plan en el modal
        this.updatePlanInfo(plan, price, name);
        
        // Mostrar modal
        if (this.modal) {
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer campo
            setTimeout(() => {
                const firstInput = this.modal.querySelector('input[required]');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }
    
    updatePlanInfo(plan, price, name) {
        // Actualizar título
        const planNameElement = document.getElementById('contractPlanName');
        if (planNameElement) planNameElement.textContent = name;
        
        // Actualizar título del plan
        const planTitleElement = document.getElementById('contractPlanTitle');
        if (planTitleElement) planTitleElement.textContent = name;
        
        // Actualizar precio
        const planPriceElement = document.getElementById('contractPlanPrice');
        if (planPriceElement) planPriceElement.textContent = price;
        
        // Actualizar descripción
        const planDescElement = document.getElementById('contractPlanDescription');
        if (planDescElement) {
            planDescElement.textContent = this.getPlanDescription(plan);
        }
    }
    
    getPlanDescription(plan) {
        const descriptions = {
            'basico': 'Sitio web profesional con diseño moderno y responsive',
            'profesional': 'Sitio web avanzado con funcionalidades personalizadas',
            'premium': 'Sitio web completo con e-commerce y funcionalidades premium',
            'mantenimiento': 'Servicio de mantenimiento y actualizaciones'
        };
        
        return descriptions[plan.toLowerCase()] || 'Plan personalizado';
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Limpiar formulario
        if (this.form) {
            this.form.reset();
        }
        
        this.currentPlan = null;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.currentPlan) {
            console.error('No hay plan seleccionado');
            return;
        }
        
        // Validar formulario
        if (!this.validateForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getFormData();
        
        // Mostrar loading
        const submitBtn = document.getElementById('continueToPayment');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        try {
            // Enviar información del proyecto por email
            await this.sendProjectInfo(formData);
            
            // Redirigir a Stripe
            this.redirectToStripe();
            
        } catch (error) {
            console.error('Error al procesar:', error);
            this.showError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
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
        const emailField = document.getElementById('contractEmail');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('error');
                isValid = false;
            }
        }
        
        // Validar teléfono
        const phoneField = document.getElementById('contractPhone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                phoneField.classList.add('error');
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showError('Por favor, completa todos los campos obligatorios correctamente.');
        }
        
        return isValid;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convertir FormData a objeto
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Añadir información del plan
        data.plan = this.currentPlan.plan;
        data.planName = this.currentPlan.name;
        data.planPrice = this.currentPlan.price;
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    async sendProjectInfo(formData) {
        // Si hay configuración de EmailJS, enviar email
        if (this.config.email && this.config.email.serviceId) {
            try {
                // Configurar EmailJS si está disponible
                if (window.emailjs) {
                    const templateParams = {
                        to_email: 'info@nextsite.es', // Tu email
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        company: formData.company || 'No especificado',
                        plan_name: formData.planName,
                        plan_price: formData.planPrice,
                        website_name: formData.websiteName,
                        website_type: formData.websiteType,
                        industry: formData.industry || 'No especificado',
                        colors: formData.colors || 'No especificado',
                        style: formData.style || 'No especificado',
                        inspiration: formData.inspiration || 'No especificado',
                        features: formData.features || 'No especificado',
                        pages: formData.pages || 'No especificado',
                        timeline: formData.timeline || 'No especificado',
                        budget: formData.budget || 'No especificado',
                        message: formData.message || 'No especificado',
                        timestamp: formData.timestamp
                    };
                    
                    await window.emailjs.send(
                        this.config.email.serviceId,
                        this.config.email.templateId,
                        templateParams,
                        this.config.email.publicKey
                    );
                }
            } catch (error) {
                console.warn('No se pudo enviar el email:', error);
                // No bloquear el proceso si falla el email
            }
        }
    }
    
    redirectToStripe() {
        const paymentLink = this.getStripePaymentLink();
        
        if (paymentLink) {
            // Cerrar modal
            this.closeModal();
            
            // Redirigir a Stripe
            window.open(paymentLink, '_blank');
            
            // Mostrar mensaje de confirmación
            this.showSuccessMessage();
        } else {
            this.showError('Lo siento, el plan seleccionado no está disponible para pago directo.');
        }
    }
    
    getStripePaymentLink() {
        if (!this.currentPlan || !this.config.stripe) {
            return null;
        }
        
        const paymentLinks = this.config.stripe.paymentLinks || {};
        return paymentLinks[this.currentPlan.plan.toLowerCase()] || null;
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'contract-success-message';
        message.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>¡Formulario Enviado!</h3>
                <p>Hemos recibido tu información del proyecto. Ahora serás redirigido a Stripe para completar el pago.</p>
                <p><strong>Plan:</strong> ${this.currentPlan.name}</p>
                <p><strong>Precio:</strong> ${this.currentPlan.price}</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'contract-error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="error-close" onclick="this.closest('.contract-error-message').remove()">
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
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.contractForm = new ContractForm();
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ContractForm = ContractForm;
}
