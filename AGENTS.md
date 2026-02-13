@"

\# AGENTS.md



\## Project

ControlRent - SaaS MVP for restaurant profitability control (NOT POS, NOT AFIP).



\## Stack

\- Next.js App Router + TypeScript + Tailwind

\- Prisma + PostgreSQL

\- Zod validations

\- Route Handlers under src/app/api/\*



\## Rules

\- Multi-tenant: every business table MUST include restaurantId and every query MUST be scoped by it.

\- CI must never run scaffolding tools (create-next-app) or generate the project.

\- Small PRs only: one concern per PR.

\- Avoid heavy libraries unless necessary.



\## Commands

\- npm run dev

\- npm run lint

\- npm run build

\- npx prisma generate

\- npx prisma migrate dev

"@ | Set-Content -Encoding UTF8 "AGENTS.md"



