// Payment Method Selector
class PaymentMethodSelector {
    constructor() {
        this.selectedMethod = 'stripe';
        this.initializeEventListeners();
        this.checkAvailableMethods();
    }

    initializeEventListeners() {
        // Handle payment method selection
        document.addEventListener('click', (e) => {
            const methodCard = e.target.closest('.payment-method-card');
            if (methodCard) {
                const method = methodCard.getAttribute('data-method');
                this.selectPaymentMethod(method);
            }
        });
    }

    selectPaymentMethod(method) {
        // Remove active class from all cards
        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.remove('active');
            const selectIcon = card.querySelector('.payment-method-select i');
            selectIcon.className = 'fas fa-chevron-right';
        });

        // Add active class to selected card
        const selectedCard = document.querySelector(`[data-method="${method}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
            const selectIcon = selectedCard.querySelector('.payment-method-select i');
            selectIcon.className = 'fas fa-check';
        }

        this.selectedMethod = method;
        this.showPaymentForm(method);
    }

    showPaymentForm(method) {
        const stripeSection = document.querySelector('.stripe-payment-section');
        
        if (!stripeSection) return;

        switch (method) {
            case 'stripe':
                this.showStripeForm();
                break;
            case 'apple-pay':
                this.showApplePayForm();
                break;
            case 'google-pay':
                this.showGooglePayForm();
                break;
            case 'paypal':
                this.showPayPalForm();
                break;
            case 'bizum':
                this.showBizumForm();
                break;
            case 'transfer':
                this.showTransferForm();
                break;
            default:
                this.showStripeForm();
        }
    }

    showStripeForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        stripeSection.innerHTML = `
            <h4><i class="fas fa-credit-card"></i> Información de Pago con Tarjeta</h4>
            <div id="stripe-payment-element">
                <!-- Stripe Elements will be inserted here -->
            </div>
        `;

        // Initialize Stripe if available
        if (window.stripeOnlyPayment) {
            window.stripeOnlyPayment.initializeStripe();
        }
    }

    showApplePayForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            stripeSection.innerHTML = `
                <div class="apple-pay-info">
                    <h4><i class="fab fa-apple-pay"></i> Apple Pay</h4>
                    <p>Pago seguro y rápido con Touch ID o Face ID</p>
                    <div class="apple-pay-button" onclick="paymentMethodSelector.processApplePay()">
                        <i class="fab fa-apple-pay"></i>
                        <span>Pagar con Apple Pay</span>
                    </div>
                </div>
            `;
        } else {
            stripeSection.innerHTML = `
                <div class="payment-unavailable">
                    <h4><i class="fab fa-apple-pay"></i> Apple Pay</h4>
                    <p>Apple Pay no está disponible en este dispositivo.</p>
                    <p class="unavailable-note">Usa Safari en iOS o macOS para pagar con Apple Pay.</p>
                </div>
            `;
        }
    }

    showGooglePayForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        
        if (window.google && window.google.payments) {
            stripeSection.innerHTML = `
                <div class="google-pay-info">
                    <h4><i class="fab fa-google-pay"></i> Google Pay</h4>
                    <p>Pago rápido y seguro con Google</p>
                    <div class="google-pay-button" onclick="paymentMethodSelector.processGooglePay()">
                        <i class="fab fa-google-pay"></i>
                        <span>Pagar con Google Pay</span>
                    </div>
                </div>
            `;
        } else {
            stripeSection.innerHTML = `
                <div class="payment-unavailable">
                    <h4><i class="fab fa-google-pay"></i> Google Pay</h4>
                    <p>Google Pay no está disponible en este dispositivo.</p>
                    <p class="unavailable-note">Usa Chrome en Android para pagar con Google Pay.</p>
                </div>
            `;
        }
    }

    showPayPalForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        stripeSection.innerHTML = `
            <div class="paypal-info">
                <h4><i class="fab fa-paypal"></i> PayPal</h4>
                <p>Pago seguro con tu cuenta PayPal</p>
                <div class="paypal-button" onclick="paymentMethodSelector.processPayPal()">
                    <i class="fab fa-paypal"></i>
                    <span>Pagar con PayPal</span>
                </div>
            </div>
        `;
    }

    showBizumForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        stripeSection.innerHTML = `
            <div class="bizum-info">
                <h4><i class="fas fa-mobile-alt"></i> Bizum</h4>
                <p>Pago móvil instantáneo y seguro</p>
                <div class="bizum-form">
                    <div class="form-group">
                        <label for="bizumPhone">Número de teléfono</label>
                        <input type="tel" id="bizumPhone" placeholder="+34 600 000 000" maxlength="15">
                    </div>
                    <button class="bizum-button" onclick="paymentMethodSelector.processBizum()">
                        <i class="fas fa-mobile-alt"></i>
                        Enviar Bizum
                    </button>
                </div>
            </div>
        `;
    }

    showTransferForm() {
        const stripeSection = document.querySelector('.stripe-payment-section');
        stripeSection.innerHTML = `
            <div class="transfer-info">
                <h4><i class="fas fa-university"></i> Transferencia Bancaria</h4>
                <p>Realiza una transferencia bancaria a nuestra cuenta</p>
                <div class="transfer-details">
                    <div class="transfer-item">
                        <strong>IBAN:</strong> ES12 1234 5678 9012 3456 7890
                    </div>
                    <div class="transfer-item">
                        <strong>Concepto:</strong> NextSite - Plan Web
                    </div>
                    <div class="transfer-item">
                        <strong>Importe:</strong> <span id="transferAmount">€299.00</span>
                    </div>
                </div>
                <div class="transfer-note">
                    <i class="fas fa-info-circle"></i>
                    Una vez realizada la transferencia, envíanos el justificante por email.
                </div>
            </div>
        `;

        // Update transfer amount
        this.updateTransferAmount();
    }

    updateTransferAmount() {
        const transferAmount = document.getElementById('transferAmount');
        if (transferAmount && window.discountHandler) {
            const amount = window.discountHandler.getFinalTotal();
            transferAmount.textContent = `€${amount.toFixed(2)}`;
        }
    }

    async processApplePay() {
        try {
            if (window.stripeIntegration && window.stripeIntegration.handleApplePay) {
                await window.stripeIntegration.handleApplePay();
            } else {
                alert('Apple Pay no está configurado. Por favor, usa otro método de pago.');
            }
        } catch (error) {
            console.error('Apple Pay error:', error);
            alert('Error con Apple Pay. Por favor, usa otro método de pago.');
        }
    }

    async processGooglePay() {
        try {
            if (window.stripeIntegration && window.stripeIntegration.handleGooglePay) {
                await window.stripeIntegration.handleGooglePay();
            } else {
                alert('Google Pay no está configurado. Por favor, usa otro método de pago.');
            }
        } catch (error) {
            console.error('Google Pay error:', error);
            alert('Error con Google Pay. Por favor, usa otro método de pago.');
        }
    }

    async processPayPal() {
        try {
            if (window.paymentIntegration && window.paymentIntegration.createPayPalCheckout) {
                const items = window.cart ? window.cart.items : [];
                await window.paymentIntegration.createPayPalCheckout(items);
            } else {
                alert('PayPal no está configurado. Por favor, usa otro método de pago.');
            }
        } catch (error) {
            console.error('PayPal error:', error);
            alert('Error con PayPal. Por favor, usa otro método de pago.');
        }
    }

    async processBizum() {
        const phone = document.getElementById('bizumPhone')?.value;
        
        if (!phone) {
            alert('Por favor, introduce tu número de teléfono para Bizum.');
            return;
        }

        try {
            // Simulate Bizum processing
            alert(`Bizum enviado al número ${phone}. Por favor, confirma el pago en tu banco.`);
            
            // Simulate successful payment
            if (window.cart) {
                await window.cart.processPayment('bizum');
            }
        } catch (error) {
            console.error('Bizum error:', error);
            alert('Error procesando el Bizum. Por favor, intenta de nuevo.');
        }
    }

    checkAvailableMethods() {
        // Check Apple Pay availability
        const applePayCard = document.getElementById('applePayMethod');
        if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
            if (applePayCard) {
                applePayCard.style.opacity = '0.6';
                applePayCard.style.cursor = 'not-allowed';
                applePayCard.title = 'Apple Pay no disponible en este dispositivo';
            }
        }

        // Check Google Pay availability
        const googlePayCard = document.getElementById('googlePayMethod');
        if (!window.google || !window.google.payments) {
            if (googlePayCard) {
                googlePayCard.style.opacity = '0.6';
                googlePayCard.style.cursor = 'not-allowed';
                googlePayCard.title = 'Google Pay no disponible en este dispositivo';
            }
        }
    }

    getSelectedMethod() {
        return this.selectedMethod;
    }
}

// Initialize payment method selector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentMethodSelector = new PaymentMethodSelector();
});
