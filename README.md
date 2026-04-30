# D2C Personal Marketplace System

Platform e-commerce **direct-to-consumer single-store** — katalog, keranjang,
checkout, pembayaran (Midtrans), pengiriman (RajaOngkir), dan dashboard admin.

> Status: 🏗️ Foundation/scaffold. Lihat [`roadmap.md`](./roadmap.md) untuk milestone.

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **UI**: Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) + lucide-react
- **Database**: [TiDB Cloud](https://tidbcloud.com) (MySQL-compatible)
- **ORM**: [Prisma](https://www.prisma.io) (`prisma-client` engine)
- **Auth**: [Auth.js v5](https://authjs.dev) (NextAuth) + Prisma adapter + Bcrypt
- **Validation**: [Zod](https://zod.dev)
- **Payment**: [Midtrans Snap](https://midtrans.com)
- **Shipping**: [RajaOngkir](https://rajaongkir.com)

## Getting started

### 1. Prasyarat

- Node.js ≥ 20.19 (recommended 22)
- TiDB Cloud account — atau gunakan **TiDB Cloud Zero** (disposable sandbox 30
  hari, tanpa sign-up): `curl -XPOST https://zero.tidbapi.com/v1beta1/instances`.

### 2. Install & konfigurasi

```bash
git clone https://github.com/IchsanJunaedi/marketplace
cd marketplace
npm install
cp .env.example .env
# isi DATABASE_URL & AUTH_SECRET (openssl rand -base64 32)
```

### 3. Sinkron skema ke database

```bash
npx prisma db push      # dev: sync schema langsung
npx prisma generate     # generate Prisma Client
```

Setelah skema stabil, gunakan `npx prisma migrate dev` untuk membuat migration
file yang trackable.

### 4. Jalankan dev server

```bash
npm run dev
```

Buka <http://localhost:3000>.

## Skrip yang tersedia

| Skrip | Fungsi |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run db:push` | `prisma db push` |
| `npm run db:studio` | Prisma Studio |

## Struktur folder

```
.
├── prisma/
│   └── schema.prisma         # ERD source of truth
├── src/
│   ├── app/                  # Next.js App Router (storefront + admin)
│   ├── lib/
│   │   ├── db.ts             # Prisma singleton
│   │   ├── env.ts            # validated env (Zod)
│   │   └── utils.ts          # cn(), formatIDR()
│   └── generated/prisma/     # Prisma Client (gitignored)
├── .env.example
├── prisma.config.ts
└── roadmap.md                # roadmap proyek
```

## Deployment

Target awal: Vercel + TiDB Cloud. Lihat `roadmap.md` Milestone 8.

## Lisensi

Proprietary — proyek pribadi. Hubungi pemilik repo sebelum redistribusi.
