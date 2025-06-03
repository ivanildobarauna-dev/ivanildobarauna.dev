#!/bin/bash

# Aguarda o servidor Next.js iniciar
echo "Aguardando o servidor Next.js iniciar..."
sleep 10

# Executa os testes de healthcheck
echo "Executando testes de healthcheck..."
npm run test:health

# Verifica o resultado dos testes
if [ $? -eq 0 ]; then
    echo "Healthcheck passou com sucesso!"
    exit 0
else
    echo "Healthcheck falhou!"
    exit 1
fi 
