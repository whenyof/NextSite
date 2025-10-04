#!/bin/bash

# Solución simple para limpiar el historial de Git
echo "🧹 LIMPIEZA SIMPLE DEL HISTORIAL DE GIT"
echo "======================================"

# Crear backup
echo "📦 Creando backup..."
cp -r . ../nextsite-backup-$(date +%Y%m%d-%H%M%S)

# Verificar que los archivos están limpios
echo "🔍 Verificando archivos..."
if grep -q "sk-proj-" chatbot-config.js chatbot-security.js 2>/dev/null; then
    echo "❌ ERROR: Los archivos aún contienen API keys"
    echo "   Ejecutando limpieza de archivos..."
    
    # Limpiar chatbot-config.js
    sed -i '' 's/apiKey: .*/apiKey: "",/' chatbot-config.js
    echo "✅ chatbot-config.js limpiado"
    
    # Limpiar chatbot-security.js  
    sed -i '' 's/apiKey: .*/apiKey: "",/' chatbot-security.js
    echo "✅ chatbot-security.js limpiado"
fi

# Agregar archivos modificados
echo "📝 Agregando archivos modificados..."
git add chatbot-config.js chatbot-security.js config.js .gitignore README.md DEPLOYMENT.md

# Verificar que config.js NO se agregó
if git status --porcelain | grep -q "config.js"; then
    echo "❌ ERROR: config.js se está agregando"
    git reset config.js
    echo "✅ config.js removido del staging"
fi

# Crear commit
echo "💾 Creando commit limpio..."
git commit -m "Security: Remove API keys from public files

- API keys moved to secure config.js (not in Git)
- chatbot-config.js and chatbot-security.js now clean
- Added comprehensive .gitignore
- Added documentation and deployment guides
- Functionality maintained via secure configuration"

# Mostrar estado
echo "📋 Estado del repositorio:"
git status

echo ""
echo "🚀 Listo para subir a GitHub"
echo "   Ejecuta: git push --force-with-lease origin main"
echo ""
echo "⚠️  Si GitHub sigue detectando secretos, usa:"
echo "   ./clean-history-definitive.sh"
