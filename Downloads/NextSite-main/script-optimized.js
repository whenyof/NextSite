// Optimized NextSite Script - Minified and Performance Focused
(function(){
'use strict';

// Cache DOM elements
const elements = {
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    navMenu: document.getElementById('nav-menu'),
    hamburger: document.querySelectorAll('.hamburger'),
    navbar: document.getElementById('navbar'),
    contactModal: document.getElementById('contactModal'),
    openContactForm: document.getElementById('openContactForm'),
    closeContactForm: document.getElementById('closeContactForm'),
    contactForm: document.getElementById('contactForm')
};

// Mobile menu functionality
if(elements.mobileMenuToggle&&elements.navMenu){
    elements.mobileMenuToggle.addEventListener('click',()=>{
        elements.navMenu.classList.toggle('active');
        elements.hamburger.forEach(bar=>bar.classList.toggle('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link=>{
        link.addEventListener('click',()=>{
            elements.navMenu.classList.remove('active');
            elements.hamburger.forEach(bar=>bar.classList.remove('active'));
        });
    });
}

// Optimized navbar scroll handling with throttling
let lastScrollY=window.scrollY;
let ticking=false;

function updateNavbar(){
    const currentScrollY=window.scrollY;
    if(currentScrollY>50){
        elements.navbar.classList.add('scrolled');
    }else{
        elements.navbar.classList.remove('scrolled');
    }
    if(currentScrollY>lastScrollY&&currentScrollY>100){
        elements.navbar.classList.add('hidden');
    }else{
        elements.navbar.classList.remove('hidden');
    }
    lastScrollY=currentScrollY;
    ticking=false;
}

function requestTick(){
    if(!ticking){
        requestAnimationFrame(updateNavbar);
        ticking=true;
    }
}

window.addEventListener('scroll',requestTick,{passive:true});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',function(e){
        e.preventDefault();
        const target=document.querySelector(this.getAttribute('href'));
        if(target){
            const offsetTop=target.offsetTop-70;
            window.scrollTo({top:offsetTop,behavior:'smooth'});
        }
    });
});

// Intersection Observer for animations
const observerOptions={threshold:0.1,rootMargin:'0px 0px -50px 0px'};
const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
},observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el=>{
    observer.observe(el);
});

// Staggered animations
document.querySelectorAll('.benefit-item').forEach((item,index)=>{
    item.style.animationDelay=`${index*0.1}s`;
});

document.querySelectorAll('.pricing-card').forEach((item,index)=>{
    item.style.animationDelay=`${index*0.15}s`;
});

// Contact modal functionality
function openContactModal(){
    if(elements.contactModal){
        elements.contactModal.classList.add('active');
        document.body.style.overflow='hidden';
    }
}

if(elements.openContactForm&&elements.contactModal){
    elements.openContactForm.addEventListener('click',(e)=>{
        e.preventDefault();
        openContactModal();
    });
}

// Footer service links - open contact form
document.addEventListener('DOMContentLoaded',()=>{
    const footerServiceLinks=document.querySelectorAll('.footer-service-link');
    footerServiceLinks.forEach(link=>{
        link.addEventListener('click',(e)=>{
            e.preventDefault();
            openContactModal();
        });
    });
});

if(elements.closeContactForm){
    elements.closeContactForm.addEventListener('click',()=>{
        elements.contactModal.classList.remove('active');
        document.body.style.overflow='auto';
    });
}

if(elements.contactModal){
    elements.contactModal.addEventListener('click',(e)=>{
        if(e.target===elements.contactModal||e.target.classList.contains('modal-overlay')){
            elements.contactModal.classList.remove('active');
            document.body.style.overflow='auto';
        }
    });
}

// Form submission with EmailJS
if(elements.contactForm){
    elements.contactForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const submitBtn=elements.contactForm.querySelector('.submit-btn');
        const btnText=submitBtn.querySelector('.btn-text');
        const btnLoading=submitBtn.querySelector('.btn-loading');
        
        submitBtn.classList.add('loading');
        submitBtn.disabled=true;
        
        const formData=new FormData(elements.contactForm);
        const data=Object.fromEntries(formData);
        
        try{
            if(typeof emailjs==='undefined'){
                throw new Error('EmailJS no está cargado');
            }
            
            const templateParams={
                from_name:data.nombre,
                from_company:data.empresa||'No especificada',
                from_email:data.email,
                from_phone:data.telefono||'No especificado',
                plan_interes:data.plan,
                project_description:data.proyecto,
                delivery_time:data.plazo||'No especificado',
                message:data.plan+' - '+data.proyecto,
                date:new Date().toLocaleString('es-ES')
            };
            
            const confirmationParams={
                to_name:data.nombre,
                to_email:data.email,
                plan_selected:data.plan,
                project_description:data.proyecto,
                delivery_time:data.plazo||'No especificado',
                current_date:new Date().toLocaleDateString('es-ES',{
                    year:'numeric',
                    month:'long',
                    day:'numeric'
                }),
                current_time:new Date().toLocaleTimeString('es-ES',{
                    hour:'2-digit',
                    minute:'2-digit'
                }),
                company_name:'NextSite',
                contact_email:'info@nextsite.es',
                website_url:'https://nextsite.es',
                support_message:'Si tiene alguna pregunta, no dude en contactarnos.'
            };
            
            // Get EmailJS configuration from secure config
            const emailjsConfig = window.NextSiteConfig?.emailjs || {
                publicKey: "Gi9mcTal5Dla_Worb",
                serviceId: "service_cxiow2d",
                templateId: "template_f7i9j0p",
                confirmationTemplateId: "template_bke6cwj"
            };
            
            await emailjs.init(emailjsConfig.publicKey);
            
            await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams);
            await emailjs.send(emailjsConfig.serviceId, emailjsConfig.confirmationTemplateId, confirmationParams);
            
            showSuccessPopup();
            elements.contactForm.reset();
            elements.contactModal.classList.remove('active');
            document.body.style.overflow='auto';
            
        }catch(error){
            console.error('Error:',error);
            let errorMessage='❌ Error al enviar el formulario.\n\n';
            if(error.status===400&&error.text&&error.text.includes('Public Key is invalid')){
                errorMessage+='🔑 La clave pública de EmailJS no es válida.\n\n';
                errorMessage+='📧 SOLUCIÓN: Contacta directamente a info@nextsite.com\n\n';
                errorMessage+='📋 Tus datos del formulario:\n';
                errorMessage+=`• Nombre: ${data.nombre}\n`;
                errorMessage+=`• Email: ${data.email}\n`;
                errorMessage+=`• Plan: ${data.plan}\n`;
                errorMessage+=`• Proyecto: ${data.proyecto}\n\n`;
                errorMessage+='💡 Puedes copiar estos datos y enviarlos por email.';
            }else{
                errorMessage+='🔧 Error técnico de configuración.\n\n';
                errorMessage+='📧 Contacta directamente a info@nextsite.com\n';
                errorMessage+=`📋 Error: ${error.text||error.message||'Desconocido'}`;
            }
            alert(errorMessage);
        }finally{
            submitBtn.classList.remove('loading');
            submitBtn.disabled=false;
        }
    });
}

// Success popup function
function showSuccessPopup(){
    const successPopup=document.createElement('div');
    successPopup.className='success-popup';
    successPopup.innerHTML=`
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
    document.body.style.overflow='hidden';
    
    setTimeout(()=>{
        successPopup.classList.add('active');
    },10);
}

function closeSuccessPopup(){
    const successPopup=document.querySelector('.success-popup');
    if(successPopup){
        successPopup.classList.remove('active');
        setTimeout(()=>{
            successPopup.remove();
            document.body.style.overflow='auto';
        },300);
    }
}

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded',()=>{
    const faqItems=document.querySelectorAll('.faq-item');
    faqItems.forEach(item=>{
        const question=item.querySelector('.faq-question');
        if(question){
            question.addEventListener('click',()=>{
                const isActive=item.classList.contains('active');
                // Close all FAQ items
                faqItems.forEach(faqItem=>{
                    faqItem.classList.remove('active');
                });
                // Open clicked item if it wasn't active
                if(!isActive){
                    item.classList.add('active');
                }
            });
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&elements.contactModal.classList.contains('active')){
        elements.contactModal.classList.remove('active');
        document.body.style.overflow='auto';
    }
});

// Click outside to close
document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('success-overlay')){
        closeSuccessPopup();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded',()=>{
    document.body.style.opacity='1';
    
    setTimeout(()=>{
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach((el,index)=>{
            setTimeout(()=>{
                el.classList.add('visible');
            },index*100);
        });
    },500);
});

// Load static data from JSON
async function loadStaticData(){
    try{
        const response=await fetch('./data.json');
        const data=await response.json();
        window.nextsiteData=data;
    }catch(error){
        console.warn('Could not load static data:',error);
    }
}

// Initialize data loading
loadStaticData();

})();
