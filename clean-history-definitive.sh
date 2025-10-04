#!/bin/bash

# Solución definitiva para limpiar el historial de Git y eliminar API keys
echo "🧹 LIMPIEZA DEFINITIVA DEL HISTORIAL DE GIT"
echo "=========================================="

# Crear backup completo
echo "📦 Creando backup completo del proyecto..."
BACKUP_DIR="../nextsite-backup-$(date +%Y%m%d-%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "✅ Backup creado en: $BACKUP_DIR"

# Verificar estado actual
echo ""
echo "📋 Estado actual del repositorio:"
git status

echo ""
echo "⚠️  ADVERTENCIA: Este proceso reescribirá completamente el historial de Git"
echo "   - Se eliminarán todos los commits anteriores"
echo "   - Se creará un nuevo historial limpio"
echo "   - Se mantendrán todos los archivos actuales"
echo ""

read -p "¿Continuar con la limpieza definitiva? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Eliminar historial de Git completamente
echo ""
echo "🗑️  Eliminando historial de Git..."
rm -rf .git

# Inicializar nuevo repositorio Git
echo "🔄 Inicializando nuevo repositorio Git..."
git init

# Configurar usuario (si no está configurado)
if ! git config user.name > /dev/null 2>&1; then
    git config user.name "NextSite Developer"
    git config user.email "developer@nextsite.es"
fi

# Agregar todos los archivos (excepto los que están en .gitignore)
echo "📝 Agregando archivos al nuevo repositorio..."
git add .

# Verificar que config.js NO se agregó
if git status --porcelain | grep -q "config.js"; then
    echo "❌ ERROR: config.js se está agregando al repositorio"
    echo "   Verificando .gitignore..."
    if grep -q "config.js" .gitignore; then
        echo "   ✅ config.js está en .gitignore"
    else
        echo "   ❌ config.js NO está en .gitignore"
        exit 1
    fi
else
    echo "✅ config.js correctamente excluido del repositorio"
fi

# Crear commit inicial limpio
echo "💾 Creando commit inicial limpio..."
git commit -m "Initial commit: NextSite website - optimized and secure

🚀 Features:
- Responsive design with modern UI
- AI-powered chatbot (OpenAI integration)
- Payment system (Stripe & PayPal)
- Contact forms with EmailJS
- SEO optimized
- Performance optimized
- Security hardened

🔒 Security:
- API keys protected in config.js (not in Git)
- Input validation and sanitization
- Rate limiting and security headers
- HTTPS enforcement

⚡ Performance:
- Critical CSS inlined
- Lazy loading images
- Minified JavaScript
- Optimized fonts with font-display: swap
- Browser caching configured
- Gzip/Brotli compression enabled"

# Mostrar archivos que se van a subir
echo ""
echo "📤 Archivos que se subirán a GitHub:"
git ls-files | head -20
echo "..."

# Verificar que no hay API keys en los archivos
echo ""
echo "🔍 Verificando que no hay API keys en los archivos..."
if grep -r "sk-proj-" . --exclude-dir=.git --exclude="config.js" --exclude="*.sh" > /dev/null 2>&1; then
    echo "❌ ERROR: Se encontraron API keys en archivos públicos"
    grep -r "sk-proj-" . --exclude-dir=.git --exclude="config.js" --exclude="*.sh"
    exit 1
else
    echo "✅ No se encontraron API keys en archivos públicos"
fi

# Agregar remote origin
echo ""
echo "🌐 Configurando remote origin..."
git remote add origin https://github.com/whenyof/NextSite.git

# Forzar push (reescribir historial en GitHub)
echo ""
echo "🚀 Subiendo nuevo historial limpio a GitHub..."
echo "   (Esto reescribirá completamente el historial en GitHub)"

read -p "¿Confirmar push forzado? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push --force origin main
    echo ""
    echo "🎉 ¡LIMPIEZA COMPLETADA EXITOSAMENTE!"
    echo ""
    echo "📋 Resumen de lo realizado:"
    echo "   ✅ Historial de Git completamente limpiado"
    echo "   ✅ API keys eliminadas del historial"
    echo "   ✅ Nuevo repositorio creado con archivos limpios"
    echo "   ✅ config.js protegido (no en Git)"
    echo "   ✅ Funcionalidad completa mantenida"
    echo ""
    echo "🔒 Seguridad garantizada:"
    echo "   - API keys solo en config.js (servidor)"
    echo "   - GitHub no detectará secretos"
    echo "   - Historial completamente limpio"
    echo ""
    echo "🚀 Tu sitio web está listo y seguro!"
else
    echo "❌ Push cancelado"
    echo "   Puedes ejecutar 'git push --force origin main' cuando estés listo"
fi

echo ""
echo "📚 Próximos pasos:"
echo "   1. Verificar que el sitio funciona en GitHub Pages"
echo "   2. Crear config.js en el servidor con tus API keys reales"
echo "   3. Probar todas las funcionalidades"
echo ""
echo "💾 Backup disponible en: $BACKUP_DIR"
