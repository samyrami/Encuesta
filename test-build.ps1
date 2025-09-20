# Script para probar el build localmente
Write-Host "🔧 Probando configuración de build..." -ForegroundColor Cyan

Write-Host "1. Limpiando build anterior..." -ForegroundColor Yellow
Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "2. Ejecutando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso!" -ForegroundColor Green
    
    Write-Host "3. Iniciando servidor de preview..." -ForegroundColor Yellow
    Write-Host "   Servidor estará disponible en: http://localhost:4173" -ForegroundColor Cyan
    Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Gray
    
    $env:PORT = "4173"
    npm start
} else {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    exit 1
}