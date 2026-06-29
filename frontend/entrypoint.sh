#!/bin/sh

# Não usamos `set -e` para que o script não quebre o terminal 
# caso algum pacote falhe ou não seja encontrado.

if [ ! -f "package.json" ]; then
  echo "=========================================="
  echo "Projeto Vue 3 não encontrado."
  echo "Criando projeto Vue 3 usando Vite..."
  echo "=========================================="
  
  # Cria o projeto em uma pasta temporária (usando Vue 3 com Vite)
  # Usamos `yes ""` para aceitar prompts automáticos e `|| true` para continuar caso falhe
  yes "" | npm create vite@latest temp-app --yes -- --template vue || true
  
  echo "Movendo arquivos para a pasta raiz do frontend..."
  mv temp-app/* . 2>/dev/null || true
  mv temp-app/.* . 2>/dev/null || true
  rmdir temp-app 2>/dev/null || true
  
  echo "Instalando dependências base..."
  npm install || true
  
  echo "Instalando Tailwind CSS..."
  npm install -D tailwindcss postcss autoprefixer || true
  
  # Inicializa o Tailwind
  echo "Inicializando configurações do Tailwind..."
  npx tailwindcss init -p || true
  
  echo "=========================================="
  echo "Projeto Vue 3 + Tailwind criado!"
  echo "Lembre-se de configurar as rotas do tailwind no tailwind.config.js e importar no src/style.css."
  echo "=========================================="
fi

# Volume anônimo pode manter node_modules desatualizado após mudanças no package.json
if [ ! -d "node_modules/vite" ] || [ ! -f "node_modules/.package-lock.json" ] || ! cmp -s package-lock.json node_modules/.package-lock.json 2>/dev/null; then
  echo "Instalando dependências do projeto..."
  npm install
fi

echo "Iniciando a aplicação..."
exec "$@"
