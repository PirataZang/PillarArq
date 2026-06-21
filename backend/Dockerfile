    FROM node:24-alpine

    # Instala utilitários básicos
    RUN apk add --no-cache bash git

    WORKDIR /app

    # Copia o script de entrypoint e dá permissão de execução
    COPY entrypoint.sh /usr/local/bin/entrypoint.sh
    RUN chmod +x /usr/local/bin/entrypoint.sh

    # O entrypoint será responsável por criar o projeto AdonisJS caso ele não exista
    ENTRYPOINT ["entrypoint.sh"]

    # Inicia o servidor de desenvolvimento do AdonisJS
    CMD ["npm", "run", "dev"]