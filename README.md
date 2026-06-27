# PillarArq — SaaS Multi-Tenant de Arquitetura e Engenharia

Sistema SaaS corporativo multi-tenant construído com **AdonisJS 6**, **Vue.js 3** e **PostgreSQL**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | AdonisJS 6, TypeScript, Lucid ORM |
| Frontend | Vue.js 3, Vite, TailwindCSS |
| Banco de Dados | PostgreSQL 16 |
| Cache | Redis 7 |
| Autenticação | JWT (jsonwebtoken) |
| Validação | VineJS |
| Infraestrutura | Docker, Docker Compose |

---

## Como Subir o Ambiente (Docker)

```bash
# Na raiz do projeto
docker compose up -d --build
```

Isso irá subir automaticamente:
- **backend** → `http://localhost:3333`
- **frontend** → `http://localhost:5173`
- **postgres** → `localhost:5432`
- **redis** → `localhost:6379`

---

## Como Executar Localmente (Sem Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Preencha as variáveis no .env

npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Migrations e Seeds

### Via Docker (dentro do container backend)

```bash
docker exec -it pillararq_backend sh

# Executar migrations
node ace migration:run

# Executar seeds (cria empresa e usuário admin)
node ace db:seed

# Resetar banco (dropar + migrar + seed)
node ace migration:fresh --seed
```

### Via Terminal Local

```bash
cd backend
node ace migration:run
node ace db:seed
```

---

## Seeds Iniciais

| Entidade | Dados |
|---|---|
| Empresa | Pillar Arq (`pillararq`) |
| Usuário Admin | `admin@pillararq.com` / `admin123` |

---

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta do backend | `3333` |
| `HOST` | Host do backend | `0.0.0.0` |
| `APP_KEY` | Chave secreta da aplicação | (gerada pelo AdonisJS) |
| `DB_HOST` | Host do PostgreSQL | `postgres` (docker) / `127.0.0.1` (local) |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USER` | Usuário do PostgreSQL | `root` |
| `DB_PASSWORD` | Senha do PostgreSQL | `root` |
| `DB_DATABASE` | Nome do banco | `app` |
| `REDIS_HOST` | Host do Redis | `redis` (docker) / `127.0.0.1` (local) |
| `REDIS_PORT` | Porta do Redis | `6379` |

---

## Estrutura do Projeto

```
pillararq/
├── docker-compose.yml
├── .env / .env.development / .env.production
│
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   │   └── http/
│   │   │       ├── auth_controller.ts
│   │   │       ├── users_controller.ts
│   │   │       └── companies_controller.ts
│   │   ├── services/
│   │   │   ├── auth_service.ts
│   │   │   ├── user_service.ts
│   │   │   └── company_service.ts
│   │   ├── models/
│   │   │   ├── company.ts
│   │   │   ├── user.ts
│   │   │   └── refresh_token.ts
│   │   ├── validators/
│   │   │   ├── auth_validator.ts
│   │   │   ├── user_validator.ts
│   │   │   └── company_validator.ts
│   │   ├── middleware/
│   │   │   ├── auth_middleware.ts       # JWT verification
│   │   │   ├── tenant_middleware.ts     # Multi-tenant isolation
│   │   │   ├── permission_middleware.ts # RBAC (prepared)
│   │   │   ├── force_json_response_middleware.ts
│   │   │   ├── container_bindings_middleware.ts
│   │   │   └── silent_auth_middleware.ts
│   │   └── exceptions/
│   │       └── handler.ts              # Global exception handler
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── start/
│   │   ├── routes.ts
│   │   ├── kernel.ts
│   │   └── env.ts
│   ├── commands/
│   │   └── make_entity.ts              # Scaffolding command
│   └── providers/
│       └── api_provider.ts
│
└── frontend/
    └── src/
        ├── components/
        ├── layouts/
        ├── pages/
        └── router/
```

---

## Arquitetura

### Padrão: Controller → Service → Model

- **Controllers**: Recebem HTTP, chamam validators, delegam para services, retornam resposta padronizada.
- **Services**: Contêm toda regra de negócio. Interagem com models.
- **Models**: Representam entidades e relacionamentos. Sem lógica de negócio.

### Multi-Tenancy

Todas as queries de negócio filtram por `company_id` do usuário autenticado.

O `company_id` **nunca** é obtido do request — sempre do `auth.user.companyId`.

### Padrão de Resposta da API

```json
// Sucesso
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {}
}

// Erro
{
  "success": false,
  "message": "Mensagem do erro",
  "errors": []
}
```

---

## API Endpoints

Todas as rotas possuem prefixo `/api/v1`.

### Autenticação (públicas)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/login` | Login com email/senha |
| POST | `/api/v1/auth/refresh` | Renovar access token |

### Autenticação (protegidas)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/logout` | Revogar refresh tokens |
| GET | `/api/v1/auth/me` | Dados do usuário logado |

### Usuários (protegidas + tenant)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/users` | Listar usuários da empresa |
| POST | `/api/v1/users` | Criar usuário |
| PUT | `/api/v1/users/:id` | Atualizar usuário |
| DELETE | `/api/v1/users/:id` | Desativar usuário (soft delete) |

### Empresas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/companies` | Criar empresa |
