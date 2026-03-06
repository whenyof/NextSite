// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.initializeEventListeners();
        this.updateCartDisplay();
        this.checkPaymentMethods();
    }

    loadCart() {
        const saved = localStorage.getItem('nextsite_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('nextsite_cart', JSON.stringify(this.items));
    }

    addItem(plan, price, name) {
        const existingItem = this.items.find(item => item.plan === plan);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                plan: plan,
                price: parseFloat(price),
                name: name,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(name);
    }

    removeItem(plan) {
        this.items = this.items.filter(item => item.plan !== plan);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(plan, quantity) {
        const item = this.items.find(item => item.plan === plan);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(plan);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getSubtotal() {
        return this.getTotal();
    }

    getTax() {
        // Since prices already include IVA, we need to calculate the tax from the total
        const totalWithTax = this.getSubtotal();
        const subtotalWithoutTax = totalWithTax / 1.21; // Remove IVA from total
        return totalWithTax - subtotalWithoutTax;
    }

    getSubtotalWithoutTax() {
        // Calculate subtotal without tax
        const totalWithTax = this.getSubtotal();
        return totalWithTax / 1.21;
    }

    getGrandTotal() {
        return this.getSubtotal(); // Total already includes tax
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Buy now - direct checkout
    buyNow(plan, price, name) {
        // Create temporary cart with single item
        const tempItems = [{
            plan: plan,
            price: parseFloat(price),
            name: name,
            quantity: 1
        }];
        
        // Open direct checkout
        this.openDirectCheckout(tempItems);
    }

    // Open direct checkout modal
    openDirectCheckout(items) {
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update checkout display with temporary items
        this.updateCheckoutDisplayWithItems(items);
    }

    // Update checkout display with specific items
    updateCheckoutDisplayWithItems(items) {
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        const checkoutTax = document.getElementById('checkoutTax');
        const checkoutTotal = document.getElementById('checkoutTotal');
        const paymentTotal = document.getElementById('paymentTotal');

        const totalWithTax = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const subtotalWithoutTax = totalWithTax / 1.21; // Remove IVA from total
        const tax = totalWithTax - subtotalWithoutTax;

        checkoutItems.innerHTML = items.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        checkoutSubtotal.textContent = `€${subtotalWithoutTax.toFixed(2)}`;
        checkoutTax.textContent = `€${tax.toFixed(2)}`;
        checkoutTotal.textContent = `€${totalWithTax.toFixed(2)}`;
        paymentTotal.textContent = `€${totalWithTax.toFixed(2)}`;
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTax = document.getElementById('cartTax');
        const cartTotal = document.getElementById('cartTotal');

        // Update cart count
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="#pricing" class="cta-button">Ver Planes</a>
                </div>
            `;
            cartFooter.style.display = 'none';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Cantidad: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="cart.removeItem('${item.plan}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            cartSubtotal.textContent = `€${this.getSubtotalWithoutTax().toFixed(2)}`;
            cartTax.textContent = `€${this.getTax().toFixed(2)}`;
            cartTotal.textContent = `€${this.getGrandTotal().toFixed(2)}`;
            cartFooter.style.display = 'block';
        }
    }

    showAddToCartNotification(productName) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${productName} añadido al carrito</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    initializeEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const plan = e.target.getAttribute('data-plan');
                const price = e.target.getAttribute('data-price');
                const name = e.target.getAttribute('data-name');
                this.addItem(plan, price, name);
            }
            
            // Buy now buttons - direct checkout
            if (e.target.classList.contains('buy-now')) {
                const plan = e.target.getAttribute('data-plan');
                const price = e.target.getAttribute('data-price');
                const name = e.target.getAttribute('data-name');
                this.buyNow(plan, price, name);
            }
        });

        // Cart modal
        const cartButton = document.getElementById('cartButton');
        const cartModal = document.getElementById('cartModal');
        const closeCartModal = document.getElementById('closeCartModal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        cartButton.addEventListener('click', () => {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeCartModal.addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        checkoutBtn.addEventListener('click', () => {
            if (this.items.length > 0) {
                this.openCheckout();
            }
        });

        // Close cart modal on overlay click
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    openCheckout() {
        const cartModal = document.getElementById('cartModal');
        const checkoutModal = document.getElementById('checkoutModal');
        
        cartModal.classList.remove('active');
        checkoutModal.classList.add('active');
        
        this.updateCheckoutDisplay();
    }

    updateCheckoutDisplay() {
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        const checkoutTax = document.getElementById('checkoutTax');
        const checkoutTotal = document.getElementById('checkoutTotal');
        const paymentTotal = document.getElementById('paymentTotal');

        checkoutItems.innerHTML = this.items.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        checkoutSubtotal.textContent = `€${this.getSubtotalWithoutTax().toFixed(2)}`;
        checkoutTax.textContent = `€${this.getTax().toFixed(2)}`;
        checkoutTotal.textContent = `€${this.getGrandTotal().toFixed(2)}`;
        paymentTotal.textContent = `€${this.getGrandTotal().toFixed(2)}`;
    }

    checkPaymentMethods() {
        // Check for Apple Pay
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            document.getElementById('applePayOption').style.display = 'block';
        }

        // Check for Google Pay
        if (window.google && window.google.payments && window.google.payments.api) {
            document.getElementById('googlePayOption').style.display = 'block';
        }
    }

    async processPayment(paymentMethod, paymentData = null) {
        try {
            // Show loading state
            const submitBtn = document.getElementById('submitPaymentBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
            submitBtn.disabled = true;

            // Use Stripe payment processing
            if (window.stripeOnlyPayment) {
                await window.stripeOnlyPayment.processPayment();
            } else {
                // Fallback simulation
                await new Promise(resolve => setTimeout(resolve, 2000));
                const success = Math.random() > 0.1; // 90% success rate for demo

                if (success) {
                    this.showPaymentSuccess();
                    this.clear();
                    this.closeCheckout();
                } else {
                    throw new Error('Payment failed');
                }
            }

        } catch (error) {
            console.error('Payment error:', error);
            alert('Error en el procesamiento del pago. Por favor, inténtalo de nuevo.');
        } finally {
            // Reset button state
            const submitBtn = document.getElementById('submitPaymentBtn');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showPaymentSuccess() {
        const successModal = document.createElement('div');
        successModal.className = 'success-popup';
        successModal.innerHTML = `
            <div class="success-overlay"></div>
            <div class="success-content">
                <div class="success-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                        <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>¡Pago Completado!</h3>
                <p>Gracias por tu compra. Hemos recibido tu pago y pronto nos pondremos en contacto contigo para comenzar con tu proyecto.</p>
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin-top: 15px; font-size: 0.9rem;">
                    <strong>📧 Confirmación por email</strong><br>
                    Te hemos enviado un email de confirmación con todos los detalles de tu compra.
                </div>
                <button class="success-btn" onclick="this.parentElement.parentElement.remove(); document.body.style.overflow='auto';">
                    <span>Entendido</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            successModal.classList.add('active');
        }, 10);
    }

    closeCheckout() {
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
    
    // Initialize checkout modal event listeners
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    
    closeCheckoutModal.addEventListener('click', () => {
        window.cart.closeCheckout();
    });
    
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            window.cart.closeCheckout();
        }
    });
    
    // Payment method buttons
    const applePayBtn = document.getElementById('applePayBtn');
    const googlePayBtn = document.getElementById('googlePayBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    const cardPaymentBtn = document.getElementById('cardPaymentBtn');
    const submitPaymentBtn = document.getElementById('submitPaymentBtn');
    
    // Apple Pay
    applePayBtn.addEventListener('click', async () => {
        try {
            const session = new ApplePaySession(3, {
                countryCode: 'ES',
                currencyCode: 'EUR',
                supportedNetworks: ['visa', 'masterCard', 'amex'],
                merchantCapabilities: ['supports3DS'],
                total: {
                    label: 'NextSite',
                    amount: window.cart.getGrandTotal().toFixed(2)
                }
            });
            
            session.begin();
            
            session.onpaymentmethodselected = (event) => {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
            };
            
            session.onpaymentauthorized = async (event) => {
                await window.cart.processPayment('applepay', event.payment);
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
            };
            
        } catch (error) {
            console.error('Apple Pay error:', error);
            alert('Error con Apple Pay. Por favor, usa otro método de pago.');
        }
    });
    
    // Google Pay
    googlePayBtn.addEventListener('click', async () => {
        try {
            if (window.google && window.google.payments && window.google.payments.api) {
                const paymentsClient = new google.payments.api.PaymentsClient({
                    environment: 'TEST' // Change to 'PRODUCTION' for live payments
                });
                
                const paymentDataRequest = {
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [{
                        type: 'CARD',
                        parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ['MASTERCARD', 'VISA']
                        },
                        tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                                gateway: 'example',
                                gatewayMerchantId: 'exampleGatewayMerchantId'
                            }
                        }
                    }],
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: window.cart.getGrandTotal().toFixed(2),
                        currencyCode: 'EUR'
                    },
                    merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'NextSite'
                    }
                };
                
                const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
                await window.cart.processPayment('googlepay', paymentData);
            }
        } catch (error) {
            console.error('Google Pay error:', error);
            alert('Error con Google Pay. Por favor, usa otro método de pago.');
        }
    });
    
    // PayPal
    paypalBtn.addEventListener('click', async () => {
        try {
            if (window.paymentIntegration && window.paymentIntegration.paypal) {
                // Get current cart items
                const items = window.cart.items.length > 0 ? window.cart.items : 
                    [{
                        plan: 'single',
                        price: parseFloat(document.getElementById('paymentTotal').textContent.replace('€', '')),
                        name: 'Compra Directa',
                        quantity: 1
                    }];
                
                // Create PayPal container
                const container = document.getElementById('paypal-button-container');
                if (!container) {
                    const newContainer = document.createElement('div');
                    newContainer.id = 'paypal-button-container';
                    paypalBtn.parentNode.appendChild(newContainer);
                }
                
                await window.paymentIntegration.createPayPalCheckout(items);
            } else {
                // Fallback to demo payment
                await window.cart.processPayment('paypal');
            }
        } catch (error) {
            console.error('PayPal integration error:', error);
            await window.cart.processPayment('paypal');
        }
    });
    
    // Card payment
    cardPaymentBtn.addEventListener('click', () => {
        const cardForm = document.getElementById('cardForm');
        cardForm.style.display = cardForm.style.display === 'none' ? 'block' : 'none';
    });
    
    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Validate payment data
            if (window.paymentIntegration) {
                window.paymentIntegration.validatePaymentData();
            }
            
            // Validate form
            const formData = new FormData(checkoutForm);
            const billingData = Object.fromEntries(formData);
            
            // Basic validation
            if (!billingData.billingName || !billingData.billingEmail || !billingData.billingPhone) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            // Check if card form is visible and use Stripe
            const cardForm = document.getElementById('cardForm');
            if (cardForm.style.display !== 'none') {
                // Use Stripe for card payments
                if (window.paymentIntegration && window.paymentIntegration.stripe) {
                    const items = window.cart.items.length > 0 ? window.cart.items : 
                        [{
                            plan: 'single',
                            price: parseFloat(document.getElementById('paymentTotal').textContent.replace('€', '')) / 1.21, // Remove tax
                            name: 'Compra Directa',
                            quantity: 1
                        }];
                    
                    await window.paymentIntegration.createStripeCheckout(items);
                } else {
                    // Fallback to demo payment
                    await window.cart.processPayment('card', billingData);
                }
            } else {
                // Other payment methods
                await window.cart.processPayment('card', billingData);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            alert(error.message || 'Error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    });
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Card expiry formatting
    const cardExpiry = document.getElementById('cardExpiry');
    cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // CVV formatting
    const cardCvv = document.getElementById('cardCvv');
    cardCvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideIn {
        from {
            transform: scale(0.7) translateY(50px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
