// Advanced Stripe Integration with Apple Pay and Google Pay
class StripeIntegration {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.paymentElement = null;
        this.initializeStripe();
    }

    async initializeStripe() {
        if (window.Stripe && PaymentConfig.stripe.publishableKey) {
            this.stripe = Stripe(PaymentConfig.stripe.publishableKey);
            
            // Initialize Apple Pay and Google Pay
            this.initializeApplePay();
            this.initializeGooglePay();
        }
    }

    // Apple Pay Integration
    initializeApplePay() {
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            const applePayButton = document.getElementById('applePayBtn');
            if (applePayButton) {
                applePayButton.style.display = 'flex';
                applePayButton.addEventListener('click', () => this.handleApplePay());
            }
        }
    }

    // Google Pay Integration
    initializeGooglePay() {
        if (window.google && window.google.payments && window.google.payments.api) {
            const googlePayButton = document.getElementById(
                'googlePayBtn');
            if (googlePayButton) {
                googlePayButton.style.display = 'flex';
                googlePayButton.addEventListener('click', () => this.handleGooglePay());
            }
        }
    }

    async handleApplePay() {
        try {
            const items = this.getCartItems();
            const total = this.calculateTotal(items);

            const session = new ApplePaySession(3, {
                countryCode: 'ES',
                currencyCode: 'EUR',
                supportedNetworks: ['visa', 'masterCard', 'amex'],
                merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
                total: {
                    label: 'NextSite',
                    amount: total.toFixed(2)
                },
                lineItems: items.map(item => ({
                    label: item.name,
                    amount: (item.price * item.quantity).toFixed(2)
                })),
                requiredBillingContactFields: ['postalAddress', 'name', 'email', 'phone'],
                requiredShippingContactFields: []
            });

            session.begin();

            session.onpaymentmethodselected = (event) => {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
            };

            session.onpaymentauthorized = async (event) => {
                try {
                    const result = await this.processStripePayment({
                        paymentMethod: 'apple_pay',
                        applePayToken: event.payment.token
                    });
                    
                    if (result.success) {
                        session.completePayment(ApplePaySession.STATUS_SUCCESS);
                        await this.handlePaymentSuccess('Apple Pay', result);
                    } else {
                        session.completePayment(ApplePaySession.STATUS_FAILURE);
                        throw new Error(result.error);
                    }
                } catch (error) {
                    console.error('Apple Pay payment error:', error);
                    session.completePayment(ApplePaySession.STATUS_FAILURE);
                    alert('Error procesando el pago con Apple Pay');
                }
            };

            session.oncancel = () => {
                console.log('Apple Pay payment cancelled');
            };

        } catch (error) {
            console.error('Apple Pay error:', error);
            alert('Error con Apple Pay. Por favor, usa otro método de pago.');
        }
    }

    async handleGooglePay() {
        try {
            if (!window.google || !window.google.payments) {
                throw new Error('Google Pay not available');
            }

            const paymentsClient = new google.payments.api.PaymentsClient({
                environment: PaymentConfig.googlePay.environment
            });

            const paymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [{
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'stripe',
                            gatewayMerchantId: PaymentConfig.stripe.publishableKey
                        }
                    }
                }],
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPriceLabel: 'Total',
                    totalPrice: this.calculateTotal(this.getCartItems()).toFixed(2),
                    currencyCode: 'EUR'
                },
                merchantInfo: {
                    merchantId: PaymentConfig.googlePay.merchantId,
                    merchantName: 'NextSite'
                },
                shippingAddressRequired: false,
                emailRequired: true
            };

            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
            
            const result = await this.processStripePayment({
                paymentMethod: 'google_pay',
                googlePayToken: paymentData.paymentMethodData.tokenizationData.token
            });

            if (result.success) {
                await this.handlePaymentSuccess('Google Pay', result);
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Google Pay error:', error);
            alert('Error con Google Pay. Por favor, usa otro método de pago.');
        }
    }

    async processStripePayment(paymentData) {
        try {
            // In a real implementation, you would call your backend
            // For now, we'll simulate a successful payment
            return {
                success: true,
                paymentIntentId: 'pi_' + Math.random().toString(36).substr(2, 9),
                clientSecret: 'pi_' + Math.random().toString(36).substr(2, 9) + '_secret_' + Math.random().toString(36).substr(2, 9)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handlePaymentSuccess(paymentMethod, result) {
        try {
            // Send confirmation email
            if (window.paymentIntegration) {
                await window.paymentIntegration.sendConfirmationEmail(paymentMethod, {
                    id: result.paymentIntentId,
                    transaction_id: result.paymentIntentId
                });
            }
            
            // Show success message
            if (window.paymentIntegration) {
                window.paymentIntegration.showPaymentSuccessModal(paymentMethod);
            }
            
            // Clear cart
            if (window.cart) {
                window.cart.clear();
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

    calculateTotal(items) {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Create Stripe Payment Element for card payments
    async createPaymentElement() {
        if (!this.stripe) return;

        try {
            // Create payment intent on your backend
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(this.calculateTotal(this.getCartItems()) * 100), // Convert to cents
                    currency: 'eur',
                    items: this.getCartItems()
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
            this.createDemoPaymentElement();
        }
    }

    createDemoPaymentElement() {
        const paymentElementContainer = document.getElementById('stripe-payment-element');
        if (paymentElementContainer) {
            paymentElementContainer.innerHTML = `
                <div style="padding: 20px; border: 2px dashed #e9ecef; border-radius: 10px; text-align: center; color: #666;">
                    <i class="fas fa-credit-card" style="font-size: 2rem; margin-bottom: 10px; color: #0a74da;"></i>
                    <p>Modo Demo - Integra Stripe para pagos reales</p>
                    <small>Los datos de la tarjeta se procesarán de forma segura</small>
                </div>
            `;
        }
    }

    async confirmPayment() {
        if (!this.stripe || !this.paymentElement) return;

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
                await this.handlePaymentSuccess('Stripe Card', paymentIntent);
            }

        } catch (error) {
            console.error('Payment confirmation error:', error);
            alert('Error procesando el pago: ' + error.message);
        }
    }
}

// Initialize Stripe integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stripeIntegration = new StripeIntegration();
    
    // Update payment method visibility
    const updatePaymentMethods = () => {
        const applePayOption = document.getElementById('applePayOption');
        const googlePayOption = document.getElementById('googlePayOption');
        
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            applePayOption.style.display = 'block';
        }
        
        if (window.google && window.google.payments && window.google.payments.api) {
            googlePayOption.style.display = 'block';
        }
    };
    
    updatePaymentMethods();
    
    // Update when payment buttons are clicked
    document.addEventListener('click', (e) => {
        if (e.target.id === 'cardPaymentBtn') {
            const cardForm = document.getElementById('cardForm');
            cardForm.style.display = cardForm.style.display === 'none' ? 'block' : 'none';
            
            if (cardForm.style.display === 'block' && window.stripeIntegration) {
                window.stripeIntegration.createPaymentElement();
            }
        }
    });
    
    // Handle form submission for Stripe
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cardForm = document.getElementById('cardForm');
            if (cardForm.style.display !== 'none' && window.stripeIntegration) {
                await window.stripeIntegration.confirmPayment();
            }
        });
    }
});
