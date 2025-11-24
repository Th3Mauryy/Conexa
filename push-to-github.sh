#!/bin/bash

# Script para subir el proyecto a GitHub de forma segura

echo "🔍 Verificando archivos sensibles..."

# Verificar que .env no esté trackeado
if git ls-files | grep -q "^\.env$\|^server/\.env$"; then
    echo "❌ ALERTA: Archivos .env encontrados en Git!"
    echo "Ejecuta: git rm --cached .env server/.env"
    exit 1
fi

echo "✅ No se encontraron archivos .env en Git"

# Mostrar archivos que se subirán
echo ""
echo "📦 Archivos que se subirán:"
git status --short

echo ""
read -p "¿Todo se ve bien? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Proceso cancelado"
    exit 1
fi

# Agregar archivos
echo "📝 Agregando archivos..."
git add .

# Commit
read -p "Mensaje del commit: " commit_msg
git commit -m "$commit_msg"

# Push
echo "🚀 Subiendo a GitHub..."
git push origin main

echo ""
echo "✅ ¡Código subido exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a https://github.com/Th3Mauryy/Conexa"
echo "2. Verifica que NO haya archivos .env"
echo "3. Sigue las instrucciones en DEPLOYMENT.md para deploy"
