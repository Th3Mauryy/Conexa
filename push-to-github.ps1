# Script PowerShell para subir a GitHub de forma segura

Write-Host "🔍 Verificando archivos sensibles..." -ForegroundColor Yellow

# Verificar que .env no esté en Git
$envFiles = git ls-files | Select-String -Pattern "^\.env$|^server/\.env$"

if ($envFiles) {
    Write-Host "❌ ALERTA: Archivos .env encontrados en Git!" -ForegroundColor Red
    Write-Host "Ejecuta: git rm --cached .env server/.env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ No se encontraron archivos .env en Git" -ForegroundColor Green

# Mostrar archivos que se subirán
Write-Host "`n📦 Archivos que se subirán:" -ForegroundColor Cyan
git status --short

Write-Host "`n¿Todo se ve bien? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -ne "S" -and $response -ne "s") {
    Write-Host "❌ Proceso cancelado" -ForegroundColor Red
    exit 1
}

# Agregar archivos
Write-Host "`n📝 Agregando archivos..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "Mensaje del commit: " -NoNewline -ForegroundColor Yellow
$commitMsg = Read-Host

git commit -m $commitMsg

# Push
Write-Host "`n🚀 Subiendo a GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ ¡Código subido exitosamente!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ve a https://github.com/Th3Mauryy/Conexa"
Write-Host "2. Verifica que NO haya archivos .env"
Write-Host "3. Sigue las instrucciones en DEPLOYMENT.md para deploy"
