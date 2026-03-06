const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.querySelectorAll('.hamburger');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.forEach(bar => bar.classList.toggle('active'));
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.forEach(bar => bar.classList.remove('active'));
    });
});

const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.benefit-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

document.querySelectorAll('.pricing-card').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.15}s`;
});

document.querySelectorAll('.maintenance-card').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
});

document.querySelectorAll('.benefit-item, .portfolio-item, .pricing-card, .maintenance-card').forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('featured')) {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('featured')) {
            item.style.transform = 'translateY(0) scale(1)';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

function showSuccessPopup() {
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.innerHTML = `
        <div class="success-overlay"></div>
        <div class="success-content">
            <div class="success-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                    <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>¡Solicitud Recibida!</h3>
            <p>Gracias por contactarnos. Hemos recibido tu solicitud de presupuesto y te hemos enviado un correo de confirmación a tu email. Pronto nos pondremos en contacto contigo.</p>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin-top: 15px; font-size: 0.9rem;">
                <strong>📧 ¿No recibiste el email de confirmación?</strong><br>
                Revisa tu carpeta de spam o correo no deseado. Si lo encuentras allí, márcalo como "no es spam" y añade <strong>info@nextsite.es</strong> a tus contactos.
            </div>
            <button class="success-btn" onclick="closeSuccessPopup()">
                <span>Entendido</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(successPopup);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        successPopup.classList.add('active');
    }, 10);
}

function closeSuccessPopup() {
    const successPopup = document.querySelector('.success-popup');
    if (successPopup) {
        successPopup.classList.remove('active');
        setTimeout(() => {
            successPopup.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('success-overlay')) {
        closeSuccessPopup();
    }
});


const contactModal = document.getElementById('contactModal');
const openContactForm = document.getElementById('openContactForm');
const closeContactForm = document.getElementById('closeContactForm');
const contactForm = document.getElementById('contactForm');

openContactForm.addEventListener('click', () => {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeContactForm.addEventListener('click', () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal || e.target.classList.contains('modal-overlay')) {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    try {
        console.log('=== ENVIANDO EMAIL ===');
        
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS no está cargado');
        }
        
        const templateParams = {
            from_name: data.nombre,
            from_company: data.empresa || 'No especificada',
            from_email: data.email,
            from_phone: data.telefono || 'No especificado',
            plan_interes: data.plan,
            project_description: data.proyecto,
            delivery_time: data.plazo || 'No especificado',
            message: data.plan + ' - ' + data.proyecto,
            date: new Date().toLocaleString('es-ES')
        };
        
        const confirmationParams = {
            to_name: data.nombre,
            to_email: data.email,
            plan_selected: data.plan,
            project_description: data.proyecto,
            delivery_time: data.plazo || 'No especificado',
            current_date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            current_time: new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            company_name: 'NextSite',
            contact_email: 'info@nextsite.es',
            website_url: 'https://nextsite.es',
            support_message: 'Si tiene alguna pregunta, no dude en contactarnos.'
        };
        
        console.log('Enviando emails...');
        
        await emailjs.init("Gi9mcTal5Dla_Worb");
        
        const result1 = await emailjs.send(
            "service_cxiow2d",
            "template_f7i9j0p",
            templateParams
        );
        
        console.log('✅ Email a NextSite enviado:', result1);
        
        const result2 = await emailjs.send(
            "service_cxiow2d",
            "template_bke6cwj",
            confirmationParams
        );
        
        console.log('✅ Email de confirmación enviado:', result2);
        
        showSuccessPopup();
        
        contactForm.reset();
        
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
    } catch (error) {
        console.error('=== TODOS LOS MÉTODOS FALLARON ===');
        console.error('Error final:', error);
        console.error('Error status:', error.status);
        console.error('Error text:', error.text);
        console.error('Error message:', error.message);
        
        let errorMessage = '❌ Error al enviar el formulario.\n\n';
        
        if (error.status === 400 && error.text && error.text.includes('Public Key is invalid')) {
            errorMessage += '🔑 La clave pública de EmailJS no es válida.\n\n';
            errorMessage += '📧 SOLUCIÓN: Contacta directamente a info@nextsite.com\n\n';
            errorMessage += '📋 Tus datos del formulario:\n';
            errorMessage += `• Nombre: ${data.nombre}\n`;
            errorMessage += `• Email: ${data.email}\n`;
            errorMessage += `• Plan: ${data.plan}\n`;
            errorMessage += `• Proyecto: ${data.proyecto}\n\n`;
            errorMessage += '💡 Puedes copiar estos datos y enviarlos por email.';
        } else {
            errorMessage += '🔧 Error técnico de configuración.\n\n';
            errorMessage += '📧 Contacta directamente a info@nextsite.com\n';
            errorMessage += `📋 Error: ${error.text || error.message || 'Desconocido'}`;
        }
        
        alert(errorMessage);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});
