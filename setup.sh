#!/usr/bin/env bash

# Instala dependências do backend via Poetry
cd "$(dirname "$0")/backend" || exit 1
poetry install || { echo 'Erro ao instalar dependências do backend'; exit 1; }

# Instala dependências do frontend via npm
cd ../frontend || exit 1
npm install || { echo 'Erro ao instalar dependências do frontend'; exit 1; }

cd ..
echo "Ambiente configurado com sucesso."
