# ControlRent

SaaS MVP for restaurant profitability control.

## Getting Started

Run the development server:

```bash
npm run dev
```

## Database setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Set a long random value for `AUTH_SECRET` in `.env`.

3. Generate Prisma Client:

```bash
npm run prisma:generate
```

4. Create/apply the initial migration:

```bash
npm run prisma:migrate
```

5. Seed demo data:

```bash
npm run seed
```

## Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`

## CRUD local verification

1. Register a new tenant at `/register` (creates restaurant + owner user).
2. Login at `/login` and open `/app/products`.
3. Create a product and confirm `POST /api/products` in browser Network.
4. Edit or activate/deactivate a product and confirm `PATCH /api/products/:id`.
5. Open `/app/fixed-costs`, create/edit/delete a row and confirm `POST/PATCH/DELETE /api/fixed-costs*`.
6. Open `/app/sales`, create a sale and confirm `POST /api/sales`.
7. Reload each page and verify persisted records are listed.
