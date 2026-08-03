@echo off
title Atualizando Base de Medicamentos - Drogasil Scraper
echo ====================================================
echo   INICIANDO ATUALIZACAO AUTOMATICA DA BASE DE DADOS
echo ====================================================
echo.

:: Navega para o diretorio do script
cd /d "%~dp0"

:: Executa o pipeline completo do Node.js
npm run update-db

echo.
echo ====================================================
echo   PROCESSO CONCLUIDO!
echo ====================================================
pause
