/**
 * Sistema de Pagos Simplificado con Enlaces Directos de Stripe
 * Más simple y seguro que la API compleja
 */

class StripeDirectPayments {
    constructor() {
        this.config = window.PaymentConfig || {};
        this.stripeLinks = this.config.stripe?.paymentLinks || {};
        
        this.init();
    }
    
    init() {
        console.log('Stripe Direct Links initialized');
        this.setupPaymentButtons();
    }
    
    /**
     * Configurar botones de pago para usar enlaces directos
     */
    setupPaymentButtons() {
        // Buscar botones "Contratar Ahora" y "Añadir al Carrito"
        const buyButtons = document.querySelectorAll('[data-plan]');
        
        buyButtons.forEach(button => {
            const plan = button.getAttribute('data-plan');
            const price = button.getAttribute('data-price');
            const name = button.getAttribute('data-name');
            
            if (button.classList.contains('buy-now')) {
                // Botón "Contratar Ahora" - Pago directo
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.processDirectPayment(plan, price, name);
                });
            } else if (button.classList.contains('add-to-cart')) {
                // Botón "Añadir al Carrito" - Mantener funcionalidad del carrito
                // No modificamos este comportamiento
            }
        });
    }
    
    /**
     * Procesar pago directo con enlace de Stripe
     */
    processDirectPayment(plan, price, name) {
        const paymentLink = this.stripeLinks[plan.toLowerCase()];
        
        if (!paymentLink) {
            console.error(`No payment link found for plan: ${plan}`);
            this.showError(`Lo siento, el plan ${name} no está disponible para pago directo.`);
            return;
        }
        
        // Mostrar confirmación antes de redirigir
        this.showPaymentConfirmation(plan, price, name, paymentLink);
    }
    
    /**
     * Mostrar confirmación antes del pago
     */
    showPaymentConfirmation(plan, price, name, paymentLink) {
        const modal = document.createElement('div');
        modal.className = 'stripe-payment-modal';
        modal.innerHTML = `
            <div class="stripe-modal-content">
                <div class="stripe-modal-header">
                    <h3><i class="fas fa-credit-card"></i> Confirmar Pago</h3>
                    <button class="stripe-modal-close">&times;</button>
                </div>
                <div class="stripe-modal-body">
                    <div class="payment-summary">
                        <div class="plan-info">
                            <h4>${name}</h4>
                            <p class="plan-description">${this.getPlanDescription(plan)}</p>
                        </div>
                        <div class="price-info">
                            <div class="price-total">
                                <span class="price-amount">${price}</span>
                                <span class="price-note">IVA incluido</span>
                            </div>
                        </div>
                    </div>
                    <div class="payment-methods">
                        <div class="stripe-payment-info">
                            <div class="stripe-logo">
                                <i class="fab fa-stripe"></i>
                            </div>
                            <div class="payment-details">
                                <h5>Pago Seguro con Stripe</h5>
                                <p>Tarjetas de crédito, débito, Apple Pay, Google Pay</p>
                                <ul class="payment-features">
                                    <li><i class="fas fa-shield-alt"></i> Pago 100% seguro</li>
                                    <li><i class="fas fa-lock"></i> Datos encriptados</li>
                                    <li><i class="fas fa-mobile-alt"></i> Apple Pay y Google Pay</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="payment-actions">
                        <button class="btn-cancel" onclick="this.closest('.stripe-payment-modal').remove()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button class="btn-pay" onclick="window.open('${paymentLink}', '_blank')">
                            <i class="fas fa-credit-card"></i> Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir estilos
        this.addModalStyles();
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer clic en X
        modal.querySelector('.stripe-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Cerrar modal con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    /**
     * Obtener descripción del plan
     */
    getPlanDescription(plan) {
        const descriptions = {
            'basico': 'Sitio web profesional con diseño moderno y responsive',
            'profesional': 'Sitio web avanzado con funcionalidades personalizadas',
            'premium': 'Sitio web completo con e-commerce y funcionalidades premium',
            'mantenimiento': 'Servicio de mantenimiento y actualizaciones'
        };
        
        return descriptions[plan.toLowerCase()] || 'Plan personalizado';
    }
    
    /**
     * Mostrar error
     */
    showError(message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'stripe-error-modal';
        errorModal.innerHTML = `
            <div class="stripe-error-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error en el Pago</h3>
                <p>${message}</p>
                <button class="btn-ok" onclick="this.closest('.stripe-error-modal').remove()">
                    <i class="fas fa-check"></i> Entendido
                </button>
            </div>
        `;
        
        document.body.appendChild(errorModal);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (errorModal.parentNode) {
                errorModal.remove();
            }
        }, 5000);
    }
    
    /**
     * Añadir estilos CSS para los modales
     */
    addModalStyles() {
        if (document.getElementById('stripe-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'stripe-modal-styles';
        styles.textContent = `
            .stripe-payment-modal {
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
            
            .stripe-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-out;
            }
            
            .stripe-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .stripe-modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .stripe-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            
            .stripe-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .stripe-modal-body {
                padding: 30px;
            }
            
            .payment-summary {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 25px;
            }
            
            .plan-info h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.3rem;
            }
            
            .plan-description {
                color: #666;
                margin: 0 0 15px 0;
                font-size: 0.95rem;
            }
            
            .price-total {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 10px;
                border: 2px solid #e9ecef;
            }
            
            .price-amount {
                font-size: 2rem;
                font-weight: bold;
                color: #28a745;
                display: block;
            }
            
            .price-note {
                font-size: 0.9rem;
                color: #666;
            }
            
            .stripe-payment-info {
                display: flex;
                align-items: center;
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 25px;
            }
            
            .stripe-logo {
                font-size: 3rem;
                color: #635bff;
                margin-right: 20px;
            }
            
            .payment-details h5 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.1rem;
            }
            
            .payment-details p {
                margin: 0 0 15px 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .payment-features {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .payment-features li {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-size: 0.9rem;
                color: #555;
            }
            
            .payment-features i {
                color: #28a745;
                margin-right: 10px;
                width: 16px;
            }
            
            .payment-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            
            .btn-cancel, .btn-pay {
                padding: 12px 25px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-cancel {
                background: #6c757d;
                color: white;
            }
            
            .btn-cancel:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .btn-pay {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-pay:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            }
            
            .stripe-error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }
            
            .stripe-error-content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .error-icon {
                font-size: 3rem;
                color: #dc3545;
                margin-bottom: 20px;
            }
            
            .stripe-error-content h3 {
                margin: 0 0 15px 0;
                color: #333;
            }
            
            .stripe-error-content p {
                margin: 0 0 25px 0;
                color: #666;
            }
            
            .btn-ok {
                background: #28a745;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0 auto;
            }
            
            .btn-ok:hover {
                background: #218838;
                transform: translateY(-2px);
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .stripe-modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .stripe-modal-body {
                    padding: 20px;
                }
                
                .stripe-payment-info {
                    flex-direction: column;
                    text-align: center;
                }
                
                .stripe-logo {
                    margin-right: 0;
                    margin-bottom: 15px;
                }
                
                .payment-actions {
                    flex-direction: column;
                }
                
                .btn-cancel, .btn-pay {
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
    window.stripeDirectPayments = new StripeDirectPayments();
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.StripeDirectPayments = StripeDirectPayments;
}
