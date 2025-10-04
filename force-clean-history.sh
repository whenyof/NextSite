#!/bin/bash

# Script para forzar la limpieza completa del historial
echo "🧹 LIMPIEZA FORZADA DEL HISTORIAL DE GIT"
echo "========================================"

# Crear backup
echo "📦 Creando backup..."
cp -r . ../nextsite-backup-force-$(date +%Y%m%d-%H%M%S)

# Eliminar completamente el directorio .git
echo "🗑️  Eliminando completamente el historial de Git..."
rm -rf .git

# Inicializar nuevo repositorio
echo "🔄 Inicializando nuevo repositorio Git..."
git init
git branch -m main

# Configurar usuario
git config user.name "NextSite Developer"
git config user.email "developer@nextsite.es"

# Agregar todos los archivos
echo "📝 Agregando archivos..."
git add .

# Verificar que config.js NO se agregó
if git status --porcelain | grep -q "config.js"; then
    echo "❌ ERROR: config.js se está agregando"
    git reset config.js
fi

# Crear commit inicial
echo "💾 Creando commit inicial..."
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

# Configurar remote
echo "🌐 Configurando remote..."
git remote add origin https://github.com/whenyof/NextSite.git

# Forzar push completo
echo "🚀 Forzando push completo..."
git push --force origin main

echo ""
echo "🎉 ¡LIMPIEZA FORZADA COMPLETADA!"
echo "📋 El repositorio ahora tiene un historial completamente limpio"
