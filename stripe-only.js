// Stripe Only Payment Integration
class StripeOnlyPayment {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.paymentElement = null;
        this.initializeStripe();
    }

    async initializeStripe() {
        if (window.Stripe && PaymentConfig.stripe.publishableKey) {
            this.stripe = Stripe(PaymentConfig.stripe.publishableKey);
            await this.createPaymentElement();
        } else {
            console.warn('Stripe not loaded or publishable key not configured');
            this.showDemoMode();
        }
    }

    async createPaymentElement() {
        try {
            // Create payment intent on your backend
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(this.getTotalAmount() * 100), // Convert to cents
                    currency: 'eur',
                    items: this.getCartItems(),
                    discount: window.discountHandler?.getDiscountInfo() || null
                })
            });

            const { clientSecret } = await response.json();

            this.elements = this.stripe.elements({
                clientSecret: clientSecret
            });

            this.paymentElement = this.elements.create('payment', {
                layout: 'tabs'
            });

            // Mount the payment element
            const paymentElementContainer = document.getElementById('stripe-payment-element');
            if (paymentElementContainer) {
                this.paymentElement.mount(paymentElementContainer);
            }

        } catch (error) {
            console.error('Error creating payment element:', error);
            // Fallback to demo mode
            this.showDemoMode();
        }
    }

    showDemoMode() {
        const paymentElementContainer = document.getElementById('stripe-payment-element');
        if (paymentElementContainer) {
            paymentElementContainer.innerHTML = `
                <div class="demo-payment-form">
                    <h4><i class="fas fa-credit-card"></i> Formulario de Pago Demo</h4>
                    <p>Para pagos reales, configura tu clave de Stripe en payment-config.js</p>
                    
                    <div class="demo-form">
                        <div class="form-group">
                            <label>Número de Tarjeta</label>
                            <input type="text" placeholder="4242 4242 4242 4242" disabled>
                            <small>Usa 4242 4242 4242 4242 para pruebas</small>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha de Expiración</label>
                                <input type="text" placeholder="12/25" disabled>
                            </div>
                            <div class="form-group">
                                <label>CVV</label>
                                <input type="text" placeholder="123" disabled>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Nombre en la Tarjeta</label>
                            <input type="text" placeholder="Juan Pérez" disabled>
                        </div>
                    </div>
                    
                    <button class="demo-pay-btn" onclick="stripeOnlyPayment.processDemoPayment()">
                        <i class="fas fa-credit-card"></i>
                        Procesar Pago Demo
                    </button>
                </div>
            `;
        }
    }

    async processDemoPayment() {
        try {
            // Simulate payment processing
            const demoPaymentData = {
                id: 'pi_demo_' + Math.random().toString(36).substr(2, 9),
                status: 'succeeded',
                amount: this.getTotalAmount() * 100,
                currency: 'eur'
            };

            await this.handlePaymentSuccess(demoPaymentData);
        } catch (error) {
            console.error('Demo payment error:', error);
            alert('Error procesando el pago demo');
        }
    }

    async processPayment() {
        // Check if Stripe is selected
        if (window.paymentMethodSelector && window.paymentMethodSelector.getSelectedMethod() !== 'stripe') {
            return; // Let the selected payment method handle it
        }

        if (!this.stripe || !this.paymentElement) {
            await this.processDemoPayment();
            return;
        }

        try {
            const { error, paymentIntent } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: window.location.origin + '/success.html',
                },
                redirect: 'if_required'
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                await this.handlePaymentSuccess(paymentIntent);
            }

        } catch (error) {
            console.error('Payment confirmation error:', error);
            alert('Error procesando el pago: ' + error.message);
        }
    }

    async handlePaymentSuccess(paymentData) {
        try {
            // Show confirmation modal first
            if (window.paymentIntegration) {
                window.paymentIntegration.showConfirmationModal('stripe', paymentData);
            }
            
            // Close checkout modal
            if (window.cart) {
                window.cart.closeCheckout();
            }
            
        } catch (error) {
            console.error('Payment success handling error:', error);
        }
    }

    getCartItems() {
        if (window.cart && window.cart.items.length > 0) {
            return window.cart.items;
        }
        
        // Fallback for direct checkout
        const totalElement = document.getElementById('paymentTotal');
        if (totalElement) {
            const total = parseFloat(totalElement.textContent.replace('€', ''));
            return [{
                plan: 'single',
                price: total / 1.21, // Remove tax
                name: 'Compra Directa',
                quantity: 1
            }];
        }
        
        return [];
    }

    getTotalAmount() {
        if (window.discountHandler && window.discountHandler.discountApplied) {
            return window.discountHandler.getFinalTotal();
        }
        
        if (window.cart) {
            return window.cart.getGrandTotal();
        }
        
        // Fallback
        const totalElement = document.getElementById('paymentTotal');
        if (totalElement) {
            return parseFloat(totalElement.textContent.replace('€', ''));
        }
        
        return 0;
    }
}

// Initialize Stripe payment when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stripeOnlyPayment = new StripeOnlyPayment();
    
    // Handle form submission for Stripe
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate required fields
            if (window.paymentIntegration && !window.paymentIntegration.validatePaymentData()) {
                return;
            }
            
            // Process payment
            if (window.stripeOnlyPayment) {
                await window.stripeOnlyPayment.processPayment();
            }
        });
    }
});
