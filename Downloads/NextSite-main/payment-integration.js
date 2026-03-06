// Advanced Payment Integration with Stripe and PayPal
class PaymentIntegration {
    constructor() {
        this.stripe = null;
        this.paypal = null;
        this.initializePaymentMethods();
    }

    async initializePaymentMethods() {
        // Initialize Stripe
        if (window.Stripe && PaymentConfig.stripe.publishableKey) {
            this.stripe = Stripe(PaymentConfig.stripe.publishableKey);
        }

        // Initialize PayPal
        if (window.paypal && PaymentConfig.paypal.clientId) {
            // PayPal is loaded via script tag
            this.paypal = window.paypal;
        }
    }

    // Stripe Checkout Integration
    async createStripeCheckout(items) {
        try {
            // In a real implementation, you would call your backend to create a checkout session
            const response = await fetch('/api/createp-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    successUrl: PaymentConfig.stripe.successUrl,
                    cancelUrl: PaymentConfig.stripe.cancelUrl,
                    currency: PaymentConfig.stripe.currency
                })
            });

            const session = await response.json();
            
            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Stripe checkout error:', error);
            // Fallback to demo mode
            this.createStripeCheckoutDemo(items);
        }
    }

    // Demo Stripe Checkout (for testing without backend)
    async createStripeCheckoutDemo(items) {
        try {
            // Create a simple checkout session for demo
            const lineItems = items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        description: `Plan de diseño web profesional`
                    },
                    unit_amount: Math.round(item.price * 100) // Convert to cents
                },
                quantity: item.quantity
            }));

            // Add tax as a separate line item
            const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
            const taxAmount = subtotal * PaymentConfig.tax.rate;

            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'IVA (21%)',
                        description: 'Impuesto sobre el valor añadido'
                    },
                    unit_amount: Math.round(taxAmount * 100)
                },
                quantity: 1
            });

            const { error } = await this.stripe.redirectToCheckout({
                line_items: lineItems,
                mode: 'payment',
                success_url: `${window.location.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${window.location.origin}/cancel.html`,
                billing_address_collection: 'required',
                customer_creation: 'always'
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Stripe demo checkout error:', error);
            alert('Error al procesar el pago con Stripe. Por favor, intenta con otro método de pago.');
        }
    }

    // PayPal Checkout Integration
    async createPayPalCheckout(items) {
        try {
            // Validate required fields before proceeding
            if (!this.validatePaymentData()) {
                return;
            }

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = total * PaymentConfig.tax.rate;
            const grandTotal = total + tax;

            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: 'EUR',
                                value: grandTotal.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: total.toFixed(2)
                                    },
                                    tax_total: {
                                        currency_code: 'EUR',
                                        value: tax.toFixed(2)
                                    }
                                }
                            },
                            items: items.map(item => ({
                                name: item.name,
                                description: 'Plan de diseño web profesional',
                                unit_amount: {
                                    currency_code: 'EUR',
                                    value: item.price.toFixed(2)
                                },
                                quantity: item.quantity.toString(),
                                category: 'DIGITAL_GOODS'
                            }))
                        }],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                },
                onApprove: async (data, actions) => {
                    try {
                        const order = await actions.order.capture();
                        await this.processPaymentSuccess('paypal', order);
                        return order;
                    } catch (error) {
                        console.error('PayPal capture error:', error);
                        alert('Error al procesar el pago con PayPal.');
                    }
                },
                onError: (err) => {
                    console.error('PayPal error:', err);
                    alert('Error con PayPal. Por favor, intenta con otro método de pago.');
                },
                onCancel: () => {
                    console.log('PayPal payment cancelled');
                }
            }).render('#paypal-button-container');
        } catch (error) {
            console.error('PayPal checkout error:', error);
            alert('Error al inicializar PayPal. Por favor, intenta con otro método de pago.');
        }
    }

    // Process successful payment
    async processPaymentSuccess(paymentMethod, paymentData) {
        try {
            // Show confirmation modal first
            this.showConfirmationModal(paymentMethod, paymentData);
            
            // Close checkout modal
            if (window.cart) {
                window.cart.closeCheckout();
            }
            
        } catch (error) {
            console.error('Payment success processing error:', error);
        }
    }

    // Send confirmation email
    async sendConfirmationEmail(paymentMethod, paymentData, confirmationData = null) {
        try {
            if (typeof emailjs !== 'undefined' && PaymentConfig.email.serviceId) {
                // Get billing info from checkout form
                const billingEmail = document.getElementById('billingEmail')?.value || confirmationData?.email || 'customer@example.com';
                const billingName = document.getElementById('billingName')?.value || confirmationData?.name || 'Cliente';
                
                // Calculate total with discount if applied
                let orderTotal = '€0.00';
                if (window.discountHandler && window.discountHandler.discountApplied) {
                    orderTotal = `€${window.discountHandler.getFinalTotal().toFixed(2)}`;
                } else if (window.cart) {
                    orderTotal = `€${window.cart.getGrandTotal().toFixed(2)}`;
                }

                const templateParams = {
                    to_email: billingEmail,
                    customer_name: billingName,
                    customer_phone: confirmationData?.phone || '',
                    customer_company: confirmationData?.company || '',
                    project_plan: confirmationData?.plan || 'Plan Contratado',
                    project_message: confirmationData?.message || '',
                    payment_method: paymentMethod.toUpperCase(),
                    payment_id: paymentData.id || paymentData.transaction_id || 'N/A',
                    order_total: orderTotal,
                    discount_applied: window.discountHandler?.discountApplied ? 'Sí' : 'No',
                    discount_code: window.discountHandler?.discountCode || '',
                    discount_amount: window.discountHandler?.discountAmount ? `€${window.discountHandler.discountAmount.toFixed(2)}` : '€0.00',
                    order_date: new Date().toLocaleDateString('es-ES'),
                    company_name: 'NextSite',
                    support_email: 'info@nextsite.es'
                };

                await emailjs.send(
                    PaymentConfig.email.serviceId,
                    PaymentConfig.email.templateId,
                    templateParams,
                    PaymentConfig.email.publicKey
                );
            }
        } catch (error) {
            console.error('Email sending error:', error);
            // Don't throw error, payment was successful
        }
    }

    // Show confirmation modal with form
    showConfirmationModal(paymentMethod, paymentData) {
        const modal = document.getElementById('paymentConfirmationModal');
        const planInput = document.getElementById('confirmPlan');
        
        if (modal && planInput) {
            // Set the plan name based on cart items
            const planName = this.getPlanNameFromCart();
            planInput.value = planName;
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Setup form submission
            this.setupConfirmationForm(paymentMethod, paymentData);
        }
    }

    // Get plan name from cart
    getPlanNameFromCart() {
        if (window.cart && window.cart.items.length > 0) {
            const item = window.cart.items[0];
            const planMap = {
                'basic': 'Plan Básico - Sitio Web Profesional',
                'professional': 'Plan Profesional - Sitio Web Avanzado',
                'premium': 'Plan Premium - Sitio Web Completo'
            };
            return planMap[item.plan] || item.name;
        }
        return 'Plan Contratado';
    }

    // Setup confirmation form submission
    setupConfirmationForm(paymentMethod, paymentData) {
        const form = document.getElementById('confirmationForm');
        const closeBtn = document.getElementById('confirmationClose');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleConfirmationSubmit(paymentMethod, paymentData);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeConfirmationModal();
            });
        }
    }

    // Handle confirmation form submission
    async handleConfirmationSubmit(paymentMethod, paymentData) {
        try {
            const formData = new FormData(document.getElementById('confirmationForm'));
            const confirmationData = Object.fromEntries(formData);
            
            // Send confirmation email with project details
            await this.sendConfirmationEmail(paymentMethod, paymentData, confirmationData);
            
            // Show success message
            this.showFinalSuccessModal();
            
            // Clear cart
            if (window.cart) {
                window.cart.clear();
            }
            
            // Close confirmation modal
            this.closeConfirmationModal();
            
        } catch (error) {
            console.error('Confirmation submission error:', error);
            alert('Error al enviar la información. Por favor, inténtalo de nuevo.');
        }
    }

    // Close confirmation modal
    closeConfirmationModal() {
        const modal = document.getElementById('paymentConfirmationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Show final success modal
    showFinalSuccessModal() {
        const successModal = document.createElement('div');
        successModal.className = 'success-popup active';
        successModal.innerHTML = `
            <div class="success-overlay"></div>
            <div class="success-content">
                <div class="success-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                        <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>¡Todo Listo!</h3>
                <p>Gracias por completar tu compra. Hemos recibido toda la información necesaria y pronto nos pondremos en contacto contigo para comenzar con tu proyecto.</p>
                
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin: 15px 0; font-size: 0.9rem;">
                    <strong>📧 Confirmación por email</strong><br>
                    Te hemos enviado un email de confirmación con todos los detalles de tu proyecto.
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9rem;">
                    <strong>⏰ Próximos pasos</strong><br>
                    • Recibirás un email de confirmación en los próximos minutos<br>
                    • Nuestro equipo se pondrá en contacto contigo en 24-48 horas<br>
                    • Comenzaremos el desarrollo de tu sitio web
                </div>
                
                <button class="success-btn" onclick="this.parentElement.parentElement.remove(); document.body.style.overflow='auto';">
                    <span>Entendido</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        document.body.style.overflow = 'hidden';
    }

    // Security validation
    validatePaymentData(data) {
        // HTTPS check
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            alert('Los pagos requieren una conexión segura (HTTPS)');
            return false;
        }

        // Required fields validation
        const requiredFields = ['billingName', 'billingEmail', 'billingPhone'];
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                alert(`El campo ${this.getFieldDisplayName(field)} es obligatorio`);
                element.focus();
                return false;
            }
        }

        // Email validation
        const email = document.getElementById('billingEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un email válido');
            document.getElementById('billingEmail').focus();
            return false;
        }

        // Phone validation
        const phone = document.getElementById('billingPhone').value;
        const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(phone)) {
            alert('Por favor, introduce un teléfono válido');
            document.getElementById('billingPhone').focus();
            return false;
        }

        return true;
    }

    // Get display name for form fields
    getFieldDisplayName(fieldId) {
        const fieldNames = {
            'billingName': 'Nombre completo',
            'billingEmail': 'Email',
            'billingPhone': 'Teléfono'
        };
        return fieldNames[fieldId] || fieldId;
    }
}

// Initialize payment integration
document.addEventListener('DOMContentLoaded', () => {
    window.paymentIntegration = new PaymentIntegration();
});
