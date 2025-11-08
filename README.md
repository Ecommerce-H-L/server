# ecommerce-server

A NestJS 11 + TypeScript backend for an e‑commerce API. Uses Prisma (PostgreSQL), JWT auth, Pino logging, Swagger docs, and testing with Jest/Supertest.

---

## 1) Environment Variables

Create a `.env` file in the project root (these values reflect your current setup):

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL="postgres://postgres:abc123@localhost:5434/ecommerce"

ACCESS_TOKEN_SECRET=access_token_secret
ACCESS_TOKEN_EXPIRES_IN=3600s
REFRESH_TOKEN_SECRET=refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

SECRET_API_KEY=secret_api_key

SUPER_ADMIN_EMAIL=super@example.com
SUPER_ADMIN_PASSWORD=123456789
SUPER_ADMIN_NAME=Super Admin

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456789
ADMIN_NAME=Admin User

USER_EMAIL=user@example.com
USER_PASSWORD=123456789
USER_NAME=Normal User
```

> In Docker Compose, the API service overrides `DATABASE_URL` to point at the `db` container. Locally (without Docker), the above URL targets a PostgreSQL instance exposed on host port **5434**.

---

## 2) Start the Database with Docker Compose

Build and start the DB services:

```bash
docker compose up --build
```

Other useful commands:

Stop and clean up:

```bash
docker compose down
```

Rebuild after code changes:

```bash
docker compose build --no-cache && docker compose up
```

## 3) Start the Server (with Prisma)

```bash
# install deps
npm install

# generate client
npm run prisma:generate

# migrate
npm run prisma:migrate-dev
# OR use push to push schema without migrations
npm run prisma:push

# seed some users records
npm run prisma:seed

# start (watch)
npm run start:dev
```

Other common commands:

```bash
# Format schema
npm run prisma:format


# Create/apply migrations for development
npm run prisma:migrate-dev

# Create migration files only (no apply)
npm run prisma:create-only

# Deploy migrations (prod/CI)
npm run prisma:deploy

# Push schema without migrations (prototyping)
npm run prisma:push

# Reset database (DANGER: drops data)
npm run prisma:reset
```

> Ensure `DATABASE_URL` is correctly set for the environment you are running (local vs Docker Compose).

---

## 4) API Documentation (Swagger)

Swagger UI is automatically available at:

- [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Or you can manually create the API docs in json for later use (like sharing):

```bash
npm run build
npm run docs:print
```

---

## 5) Postman Collection

A Postman collection is included for quick testing. Import it into Postman (`File` -> `Import` -> `Select files`):

- File path: `postman/Ecom.postman_collection.json`
- Base URL variable: `{{baseUrl}}` → default to `http://localhost:3000`

---

## NPM Scripts (Reference)

```bash
# Build
npm run build

# Start modes
npm run start
npm run start:dev
npm run start:debug
npm run start:prod

# Lint & format
npm run lint
npm run format

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:debug
npm run test:e2e

# Prisma
npm run prisma:format
npm run prisma:generate
npm run prisma:migrate-dev
npm run prisma:create-only
npm run prisma:deploy
npm run prisma:push
npm run prisma:reset
npm run prisma:seed

# Swagger printer (after build)
npm run docs:print
```

## License

UNLICENSED (see `package.json`).
