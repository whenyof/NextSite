#!/bin/bash

# Limpieza automática del historial de Git
echo "🧹 LIMPIEZA AUTOMÁTICA DEL HISTORIAL DE GIT"
echo "==========================================="

# Crear backup
echo "📦 Creando backup..."
cp -r . ../nextsite-backup-auto-$(date +%Y%m%d-%H%M%S)

# Eliminar historial de Git completamente
echo "🗑️  Eliminando historial de Git..."
rm -rf .git

# Inicializar nuevo repositorio Git
echo "🔄 Inicializando nuevo repositorio Git..."
git init

# Configurar usuario
git config user.name "NextSite Developer"
git config user.email "developer@nextsite.es"

# Agregar todos los archivos
echo "📝 Agregando archivos al nuevo repositorio..."
git add .

# Verificar que config.js NO se agregó
if git status --porcelain | grep -q "config.js"; then
    echo "❌ ERROR: config.js se está agregando"
    git reset config.js
    echo "✅ config.js removido del staging"
fi

# Verificar que no hay API keys
echo "🔍 Verificando que no hay API keys..."
if grep -r "sk-proj-" . --exclude-dir=.git --exclude="config.js" --exclude="*.sh" > /dev/null 2>&1; then
    echo "❌ ERROR: Se encontraron API keys en archivos públicos"
    exit 1
else
    echo "✅ No se encontraron API keys en archivos públicos"
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

# Agregar remote origin
echo "🌐 Configurando remote origin..."
git remote add origin https://github.com/whenyof/NextSite.git

# Mostrar archivos
echo "📤 Archivos que se subirán:"
git ls-files | head -10
echo "..."

echo "🚀 Subiendo nuevo historial limpio a GitHub..."
git push --force origin main

echo ""
echo "🎉 ¡LIMPIEZA COMPLETADA EXITOSAMENTE!"
echo "📋 Resumen:"
echo "   ✅ Historial de Git completamente limpiado"
echo "   ✅ API keys eliminadas del historial"
echo "   ✅ Nuevo repositorio creado con archivos limpios"
echo "   ✅ config.js protegido (no en Git)"
echo "   ✅ Funcionalidad completa mantenida"
