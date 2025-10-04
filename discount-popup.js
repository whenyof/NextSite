// Discount Popup System
class DiscountPopup {
    constructor() {
        this.popup = document.getElementById('discountPopup');
        this.closeBtn = document.getElementById('discountClose');
        this.form = document.getElementById('discountForm');
        this.countdownTimer = document.getElementById('countdownTimer');
        this.discountCode = null;
        this.timeLeft = 120; // 2 minutes in seconds
        this.countdownInterval = null;
        
        this.initializeEventListeners();
        this.showPopupAfterDelay();
    }

    initializeEventListeners() {
        // Close popup
        this.closeBtn.addEventListener('click', () => {
            this.hidePopup();
        });

        // Close on overlay click
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.hidePopup();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.hidePopup();
            }
        });
    }

    showPopupAfterDelay() {
        // Check if user has already seen the popup today
        const today = new Date().toDateString();
        const lastSeen = localStorage.getItem('discount_popup_seen');
        
        if (lastSeen === today) {
            return; // Don't show again today
        }

        // Show popup after 10 seconds
        setTimeout(() => {
            this.showPopup();
        }, 10000);
    }

    showPopup() {
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.startCountdown();
        
        // Send analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_view', {
                event_category: 'engagement',
                event_label: 'discount_popup'
            });
        }
    }

    hidePopup() {
        this.popup.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.stopCountdown();
        
        // Mark as seen today
        const today = new Date().toDateString();
        localStorage.setItem('discount_popup_seen', today);
    }

    startCountdown() {
        this.countdownInterval = setInterval(() => {
            this.timeLeft--;
            this.updateCountdownDisplay();
            
            if (this.timeLeft <= 0) {
                this.hidePopup();
            }
        }, 1000);
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    updateCountdownDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.countdownTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    async handleFormSubmit() {
        const email = document.getElementById('discountEmail').value;
        
        if (!email) {
            alert('Por favor, introduce tu email');
            return;
        }

        try {
            // Generate discount code
            this.discountCode = this.generateDiscountCode();
            
            // Save discount code for user
            localStorage.setItem('user_discount_code', this.discountCode);
            localStorage.setItem('user_email', email);
            
            // Send email (if EmailJS is available)
            if (typeof emailjs !== 'undefined') {
                await this.sendDiscountEmail(email);
            }
            
            // Show success message
            this.showSuccessMessage();
            
            // Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'discount_signup', {
                    event_category: 'conversion',
                    event_label: 'email_capture'
                });
            }
            
        } catch (error) {
            console.error('Error sending discount email:', error);
            // Still show success message even if email fails
            this.showSuccessMessage();
        }
    }

    generateDiscountCode() {
        return `NextSite10`;
    }

    async sendDiscountEmail(email) {
        if (typeof emailjs !== 'undefined' && PaymentConfig && PaymentConfig.email.serviceId) {
            const templateParams = {
                to_email: email,
                discount_code: this.discountCode,
                discount_percentage: '10%',
                company_name: 'NextSite',
                support_email: 'info@nextsite.es'
            };

            await emailjs.send(
                PaymentConfig.email.serviceId,
                'template_discount', // You'll need to create this template in EmailJS
                templateParams,
                PaymentConfig.email.publicKey
            );
        }
    }

    showSuccessMessage() {
        const content = this.popup.querySelector('.discount-content');
        content.innerHTML = `
            <div class="discount-close" id="discountClose">
                <i class="fas fa-times"></i>
            </div>
            <div class="discount-icon" style="background: linear-gradient(135deg, #28a745, #20c997);">
                <i class="fas fa-check"></i>
            </div>
            <h3>¡Perfecto!</h3>
            <p>Tu código de descuento del <strong>10%</strong> es:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px dashed #28a745; position: relative;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #28a745; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                    ${this.discountCode}
                </div>
                <button class="copy-btn" onclick="discountPopup.copyDiscountCode()" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 5px; margin: 0 auto;">
                    <i class="fas fa-copy"></i>
                    Copiar Código
                </button>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0a74da; margin: 20px 0; font-size: 0.9rem;">
                <strong>📧 Email enviado</strong><br>
                Te hemos enviado un email con tu código de descuento para que no lo pierdas.
            </div>
            
            <button class="discount-btn" onclick="discountPopup.hidePopup(); window.scrollTo({top: document.getElementById('pricing').offsetTop - 100, behavior: 'smooth'});">
                <i class="fas fa-shopping-cart"></i>
                Ver Planes con Descuento
            </button>
        `;
        
        // Re-add event listeners
        document.getElementById('discountClose').addEventListener('click', () => {
            this.hidePopup();
        });
    }

    copyDiscountCode() {
        navigator.clipboard.writeText(this.discountCode).then(() => {
            // Show success feedback
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            copyBtn.style.background = '#20c997';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.discountCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            copyBtn.style.background = '#20c997';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);
        });
    }

    // Method to check if user has discount
    static hasDiscount() {
        return localStorage.getItem('user_discount_code') !== null;
    }

    // Method to get discount code
    static getDiscountCode() {
        return localStorage.getItem('user_discount_code');
    }

    // Method to apply discount to price
    static applyDiscount(price) {
        if (this.hasDiscount()) {
            return price * 0.9; // 10% discount
        }
        return price;
    }
}

// Initialize discount popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.discountPopup = new DiscountPopup();
});
