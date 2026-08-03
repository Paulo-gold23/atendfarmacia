#!/usr/bin/env bash
# Script executável Bash para rodar a atualização da base de dados

cd "$(dirname "$0")"

echo "===================================================="
echo "  INICIANDO ATUALIZAÇÃO AUTOMÁTICA DA BASE DE DADOS"
echo "===================================================="
echo ""

npm run update-db

echo ""
echo "===================================================="
echo "  PROCESSO CONCLUÍDO!"
echo "===================================================="
read -p "Pressione [ENTER] para fechar..."
