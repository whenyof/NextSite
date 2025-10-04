// ========================================
// SISTEMA DE PROTECCIÓN Y SEGURIDAD - NextSite
// ========================================

(function() {
    'use strict';
    
    // ========================================
    // 1. DETECCIÓN DE HERRAMIENTAS DE DESARROLLO
    // ========================================
    
    // Detectar si las DevTools están abiertas
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c¡STOP!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cEsta página está protegida', 'color: red; font-size: 20px;');
                console.log('%cNo está permitido acceder a las herramientas de desarrollador', 'color: red; font-size: 16px;');
                console.log('%cPara más información, contacta a info@nextsite.com', 'color: blue; font-size: 14px;');
                
                // Opcional: Redirigir o mostrar mensaje
                // window.location.href = 'about:blank';
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // ========================================
    // 2. DESACTIVAR FUNCIONES DE DESARROLLO
    // ========================================
    
    // Desactivar clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityMessage('Acceso restringido - Contacta a info@nextsite.com');
        return false;
    });
    
    // Desactivar teclas de atajo comunes
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 's')) {
            e.preventDefault();
            showSecurityMessage('Función deshabilitada por seguridad');
            return false;
        }
    });
    
    // ========================================
    // 3. PROTECCIÓN DE SELECTION
    // ========================================
    
    // Desactivar selección de texto
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Desactivar arrastrar
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // ========================================
    // 4. OFUSCACIÓN DE CÓDIGO
    // ========================================
    
    // Limpiar consola periódicamente
    setInterval(function() {
        if (typeof console !== 'undefined') {
            console.clear();
            console.log('%c🔒 NextSite - Página Protegida', 'color: #ff6b35; font-size: 16px; font-weight: bold;');
            console.log('%cPara consultas técnicas: info@nextsite.com', 'color: #0a74da; font-size: 12px;');
        }
    }, 1000);
    
    // ========================================
    // 5. DETECCIÓN DE BOT Y SCRAPING
    // ========================================
    
    // Detectar si es un bot
    if (navigator.webdriver || 
        window.phantom || 
        window._phantom || 
        window.callPhantom) {
        document.body.innerHTML = '<div style="text-align:center; padding:50px; font-family:Arial;"><h2>Acceso no autorizado detectado</h2><p>Contacta a info@nextsite.com</p></div>';
    }
    
    // ========================================
    // 6. FUNCIÓN DE MENSAJE DE SEGURIDAD
    // ========================================
    
    function showSecurityMessage(message) {
        // Crear overlay temporal
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 18px;
            text-align: center;
        `;
        
        overlay.innerHTML = `
            <div>
                <h2 style="color: #ff6b35; margin-bottom: 20px;">🔒 Acceso Restringido</h2>
                <p>${message}</p>
                <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                    Para consultas: info@nextsite.com
                </p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 3000);
    }
    
    // ========================================
    // 7. PROTECCIÓN ADICIONAL
    // ========================================
    
    // Ocultar información del navegador
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
    });
    
    // Proteger contra inspección de elementos
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            showSecurityMessage('Herramientas de desarrollador deshabilitadas');
            return false;
        }
    });
    
    // ========================================
    // 8. MENSAJE INICIAL DE PROTECCIÓN
    // ========================================
    
    // Mostrar mensaje de protección al cargar
    window.addEventListener('load', function() {
        console.log('%c🔒 PÁGINA PROTEGIDA', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cEsta página está protegida contra acceso no autorizado', 'color: red; font-size: 14px;');
        console.log('%cContacta a info@nextsite.com para consultas técnicas', 'color: blue; font-size: 12px;');
    });
    
})();
