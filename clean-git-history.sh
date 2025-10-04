#!/bin/bash

# Script para limpiar el historial de Git y eliminar API keys
echo "🧹 Limpiando historial de Git para eliminar API keys..."

# Hacer backup del estado actual
echo "📦 Creando backup..."
cp -r . ../nextsite-backup

# Resetear al commit anterior (antes del commit problemático)
echo "🔄 Reseteando al commit anterior..."
git reset --hard HEAD~1

# Agregar todos los archivos limpios
echo "📝 Agregando archivos limpios..."
git add .

# Hacer nuevo commit limpio
echo "💾 Creando nuevo commit limpio..."
git commit -m "NextSite website - optimized and secure (API keys protected)"

# Forzar push (cuidado: esto reescribe el historial)
echo "🚀 Subiendo versión limpia..."
echo "⚠️  ADVERTENCIA: Esto reescribirá el historial de Git"
read -p "¿Continuar? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push --force-with-lease origin main
    echo "✅ ¡Historial limpio y subido exitosamente!"
else
    echo "❌ Operación cancelada"
    exit 1
fi

echo "🎉 ¡Proceso completado!"
echo "📋 Archivos importantes:"
echo "   - config.js (con API keys reales) - NO en Git"
echo "   - chatbot-config.js (limpio) - SÍ en Git"
echo "   - chatbot-security.js (limpio) - SÍ en Git"
