#!/bin/sh
set -e

# Se package.json não existir, entendemos que o projeto AdonisJS ainda não foi criado
if [ ! -f "package.json" ]; then
  echo "=========================================="
  echo "Projeto AdonisJS não encontrado."
  echo "Criando AdonisJS 6 (Kit API)..."
  echo "=========================================="
  
  # Cria o projeto em uma pasta temporária
  # Removi a flag --db que não existe mais no create-adonisjs recente
  npm init adonisjs@latest temp-app -- --kit=api --pkg=npm
  
  echo "Movendo arquivos para a pasta raiz do backend..."
  # Move todos os arquivos e pastas visíveis e ocultas
  mv temp-app/* . 2>/dev/null || true
  mv temp-app/.* . 2>/dev/null || true
  rmdir temp-app 2>/dev/null || true
  
  echo "Instalando pacotes do PostgreSQL e Redis..."
  # Instala as dependências, usando --legacy-peer-deps para evitar o erro ERESOLVE com as dependências do core
  npm install @adonisjs/lucid pg @adonisjs/redis --legacy-peer-deps
  
  echo "=========================================="
  echo "Projeto AdonisJS 6 criado com sucesso!"
  echo "ATENÇÃO: Você precisará rodar a configuração dos pacotes no futuro via terminal do container:"
  echo "node ace configure @adonisjs/lucid"
  echo "node ace configure @adonisjs/redis"
  echo "=========================================="
fi

# Caso o node_modules esteja vazio (por causa de mapeamento de volume anônimo)
if [ ! -d "node_modules/typescript" ]; then
  echo "Instalando dependências via npm install..."
  npm install --legacy-peer-deps
fi

echo "Iniciando a aplicação..."
# Executa o CMD passado no Dockerfile ou docker-compose.yml
exec "$@"
