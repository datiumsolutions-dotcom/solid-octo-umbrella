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

2. Generate Prisma Client:

```bash
npm run prisma:generate
```

3. Create/apply the initial migration:

```bash
npm run prisma:migrate
```

4. Seed demo data:

```bash
npm run seed
```
