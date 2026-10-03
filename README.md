# Kancharla Textiles

E-commerce store for Kancharla Textiles, Mangalagiri (Andhra Pradesh): handwoven sarees, kurtis, lehengas, nighties and leggings.

| Folder | What it is |
| --- | --- |
| `backend/` | Medusa v2 server + admin console (Postgres on Railway) |
| `storefront/` | Next.js 15 storefront |
| `docs/` | Platform blueprint |

## Run locally

Copy `backend/.env.template` to `backend/.env` and `storefront/.env.template` to `storefront/.env.local`, then fill in the values (Railway database URL, publishable key, secrets).

```bash
# terminal 1 — API + admin on http://localhost:9000/app
cd backend && yarn && yarn dev

# terminal 2 — storefront on http://localhost:8000
cd storefront && yarn && yarn dev
```

Fresh database only: `cd backend && npx medusa db:migrate && yarn seed:store`.
