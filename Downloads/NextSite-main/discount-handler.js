// Discount Handler for Checkout
class DiscountHandler {
    constructor() {
        this.discountCode = null;
        this.discountApplied = false;
        this.discountAmount = 0;
        this.originalTotal = 0;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const applyBtn = document.getElementById('applyDiscountBtn');
        const discountInput = document.getElementById('discountCode');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyDiscount());
        }
        
        if (discountInput) {
            discountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyDiscount();
                }
            });
        }
    }

    applyDiscount() {
        const discountInput = document.getElementById('discountCode');
        const messageDiv = document.getElementById('discountMessage');
        const code = discountInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showMessage('Por favor, introduce un código de descuento', 'error');
            return;
        }

        // Check if code is valid
        if (this.isValidDiscountCode(code)) {
            this.discountCode = code;
            this.discountApplied = true;
            this.calculateDiscount();
            this.updateCartTotals();
            this.showMessage(`¡Descuento aplicado! Has ahorrado €${this.discountAmount.toFixed(2)}`, 'success');
            
            // Disable input and button
            discountInput.disabled = true;
            discountInput.style.background = '#f8f9fa';
            document.getElementById('applyDiscountBtn').innerHTML = '<i class="fas fa-check"></i> Aplicado';
            document.getElementById('applyDiscountBtn').disabled = true;
            document.getElementById('applyDiscountBtn').style.background = '#28a745';
            
        } else {
            this.showMessage('Código de descuento inválido', 'error');
        }
    }

    isValidDiscountCode(code) {
        // Check localStorage for valid codes
        const savedCode = localStorage.getItem('user_discount_code');
        
        // Also check for demo codes
        const demoCodes = ['DESCUENTO10', 'WELCOME10', 'SAVE10'];
        
        return code === savedCode || demoCodes.includes(code);
    }

    calculateDiscount() {
        if (window.cart && window.cart.items.length > 0) {
            this.originalTotal = window.cart.getGrandTotal();
            this.discountAmount = this.originalTotal * 0.10; // 10% discount
        } else {
            // For direct checkout
            const totalElement = document.getElementById('paymentTotal');
            if (totalElement) {
                this.originalTotal = parseFloat(totalElement.textContent.replace('€', ''));
                this.discountAmount = this.originalTotal * 0.10;
            }
        }
    }

    updateCartTotals() {
        if (window.cart && window.cart.items.length > 0) {
            // Update cart display
            const cartTotal = document.getElementById('cartTotal');
            const checkoutTotal = document.getElementById('checkoutTotal');
            const paymentTotal = document.getElementById('paymentTotal');
            
            const newTotal = this.originalTotal - this.discountAmount;
            
            if (cartTotal) cartTotal.textContent = `€${newTotal.toFixed(2)}`;
            if (checkoutTotal) checkoutTotal.textContent = `€${newTotal.toFixed(2)}`;
            if (paymentTotal) paymentTotal.textContent = `€${newTotal.toFixed(2)}`;
            
            // Add discount line to cart
            this.addDiscountLine();
        } else {
            // Update direct checkout
            const checkoutTotal = document.getElementById('checkoutTotal');
            const paymentTotal = document.getElementById('paymentTotal');
            
            const newTotal = this.originalTotal - this.discountAmount;
            
            if (checkoutTotal) checkoutTotal.textContent = `€${newTotal.toFixed(2)}`;
            if (paymentTotal) paymentTotal.textContent = `€${newTotal.toFixed(2)}`;
            
            this.addDiscountLineToCheckout();
        }
    }

    addDiscountLine() {
        const cartItems = document.getElementById('cartItems');
        const existingDiscount = document.getElementById('discount-line');
        
        if (!existingDiscount && cartItems) {
            const discountLine = document.createElement('div');
            discountLine.id = 'discount-line';
            discountLine.className = 'cart-item';
            discountLine.style.background = '#d4edda';
            discountLine.style.border = '1px solid #c3e6cb';
            discountLine.innerHTML = `
                <div class="cart-item-info">
                    <h4>Descuento (${this.discountCode})</h4>
                    <p>Código aplicado</p>
                </div>
                <div class="cart-item-price" style="color: #28a745;">
                    -€${this.discountAmount.toFixed(2)}
                </div>
                <button class="cart-item-remove" onclick="discountHandler.removeDiscount()" style="color: #28a745;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItems.appendChild(discountLine);
        }
    }

    addDiscountLineToCheckout() {
        const checkoutItems = document.getElementById('checkoutItems');
        const existingDiscount = document.getElementById('checkout-discount-line');
        
        if (!existingDiscount && checkoutItems) {
            const discountLine = document.createElement('div');
            discountLine.id = 'checkout-discount-line';
            discountLine.className = 'checkout-item';
            discountLine.style.background = '#d4edda';
            discountLine.style.border = '1px solid #c3e6cb';
            discountLine.innerHTML = `
                <div class="checkout-item-info">
                    <h4>Descuento (${this.discountCode})</h4>
                    <p>Código aplicado</p>
                </div>
                <div class="checkout-item-price" style="color: #28a745;">
                    -€${this.discountAmount.toFixed(2)}
                </div>
            `;
            
            checkoutItems.appendChild(discountLine);
        }
    }

    removeDiscount() {
        this.discountApplied = false;
        this.discountCode = null;
        this.discountAmount = 0;
        
        // Remove discount lines
        const discountLine = document.getElementById('discount-line');
        const checkoutDiscountLine = document.getElementById('checkout-discount-line');
        
        if (discountLine) discountLine.remove();
        if (checkoutDiscountLine) checkoutDiscountLine.remove();
        
        // Reset totals
        if (window.cart) {
            window.cart.updateCartDisplay();
            window.cart.updateCheckoutDisplay();
        }
        
        // Reset input
        const discountInput = document.getElementById('discountCode');
        const applyBtn = document.getElementById('applyDiscountBtn');
        
        if (discountInput) {
            discountInput.disabled = false;
            discountInput.style.background = 'white';
            discountInput.value = '';
        }
        
        if (applyBtn) {
            applyBtn.innerHTML = '<i class="fas fa-check"></i> Aplicar';
            applyBtn.disabled = false;
            applyBtn.style.background = 'linear-gradient(135deg, #ff6b35, #e55a2b)';
        }
        
        // Hide message
        const messageDiv = document.getElementById('discountMessage');
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('discountMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `discount-message ${type}`;
            messageDiv.style.display = 'block';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    getFinalTotal() {
        if (this.discountApplied) {
            return this.originalTotal - this.discountAmount;
        }
        return this.originalTotal;
    }

    getDiscountInfo() {
        return {
            applied: this.discountApplied,
            code: this.discountCode,
            amount: this.discountAmount,
            originalTotal: this.originalTotal,
            finalTotal: this.getFinalTotal()
        };
    }
}

// Initialize discount handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.discountHandler = new DiscountHandler();
});
