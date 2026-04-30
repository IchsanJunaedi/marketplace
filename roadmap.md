# Roadmap — D2C Personal Marketplace System

> Berdasarkan **Project Plan: D2C Personal Marketplace System v1.0** (26 April 2026).
> Stack: **Next.js 16** (App Router) · **TypeScript** · **TailwindCSS v4** · **shadcn/ui** · **Prisma** · **TiDB Cloud** · **Auth.js v5** · **Midtrans** · **RajaOngkir**.

## Tujuan utama

1. **Otomasi Inventaris** — sinkronisasi stok real-time, cegah overselling (DB transactions).
2. **Integrasi Pembayaran** — Midtrans Snap (VA, e-wallet, QRIS) + webhook auto-update.
3. **Akurasi Logistik** — RajaOngkir untuk ongkir berdasar berat & lokasi.
4. **Keamanan Transaksi** — RBAC (Customer / Admin), JWT session, Bcrypt, HTTPS, XSS/SQLi guard.

## Out-of-scope (sesuai proposal)

- Aplikasi mobile native.
- Sistem multi-vendor (proyek ini single-store).
- Modul retur otomatis (manual via chat).
- WMS multi-lokasi.

---

## Timeline 8 minggu (sesuai Schedule Baseline proposal)

| Fase | Minggu | Mandays | Fokus | Deliverable |
|---|---|---|---|---|
| 1. Planning | 1–2 | 10 MD | Analisis, ERD, API contract, design freeze | DOC.01 + UIX.01 |
| 2. Core Dev | 3–4 | 20 MD | Auth, Katalog produk, Cart | APP.01 |
| 3. Transaction | 5–7 | 25 MD | Checkout, Midtrans, RajaOngkir, Order, Notif | APP.02 |
| 4. QA & Closure | 8 | 10 MD | UAT, bug fix, deployment | FIN.01 |

---

## Milestones (status saat ini)

### Milestone 0 — Foundation ✅ (PR awal ini)
- [x] Pilih tech stack & dapatkan persetujuan
- [x] Provision database (TiDB Cloud Zero, MySQL-compatible)
- [x] Scaffold Next.js 16 + TypeScript + Tailwind v4
- [x] Pasang Prisma + skema awal (User, Address, Category, Product, Cart, Order, Payment, Review, Notification)
- [x] `db push` skema ke TiDB
- [x] `roadmap.md` (file ini)
- [x] CI dasar (lint + typecheck + build)
- [ ] Port template HTML → React component _(menunggu file template)_

### Milestone 1 — Design system & layout (Minggu 1–2)
- [ ] Konfigurasi Tailwind tokens (warna, radius, shadow) sesuai template
- [ ] shadcn/ui: Button, Input, Card, Dialog, Dropdown, Tabs, Badge, Sheet
- [ ] Layout shells: storefront (header/nav/footer) & admin (sidebar/topbar)
- [ ] Halaman: storefront_home, product_catalog, product_detail_page (statis dulu, data dummy)
- [ ] Halaman admin: admin_overview (statis)

### Milestone 2 — Auth & RBAC (Minggu 3)
- [ ] Auth.js v5 + Prisma adapter
- [ ] Sign up / sign in / sign out (email + password, Bcrypt)
- [ ] Middleware proteksi route untuk `/admin/**`
- [ ] User profile page (`user_profile`) + edit data + alamat
- [ ] Settings & security page (`settings_security`) — ganti password, sesi aktif

### Milestone 3 — Katalog & Inventaris (Minggu 3–4)
- [ ] CRUD Product (admin)
- [ ] CRUD Category (tree)
- [ ] Upload gambar (multi-image, drag-drop)
- [ ] Halaman storefront katalog dengan **search + filter + pagination**
- [ ] Stock management dengan transactional decrement saat checkout
- [ ] Halaman `inventory_management` (admin)

### Milestone 4 — Cart & Checkout (Minggu 4–5)
- [ ] Cart (Server Action + optimistic UI)
- [ ] Halaman `shopping_cart`
- [ ] Halaman `checkout_process` (multi-step: alamat → kurir → bayar)
- [ ] Integrasi RajaOngkir (province, city, cost endpoints)
- [ ] Validasi stok atomik (DB transaction + row-level lock)

### Milestone 5 — Pembayaran (Minggu 5–6)
- [ ] Midtrans Snap (server-side create transaction)
- [ ] Webhook handler `/api/midtrans/webhook` → auto-update OrderStatus
- [ ] Auto-cancel order setelah `expiresAt`
- [ ] Riwayat order (`order_management` user) + detail

### Milestone 6 — Admin Dashboard (Minggu 6–7)
- [ ] `admin_overview` dengan KPI + grafik (Recharts)
- [ ] `customer_management` (list, detail, blokir)
- [ ] `order_management` admin (status update, input resi)
- [ ] `enterprise_precision` (laporan akurasi/operasional)
- [ ] `corporate_storefront_logic` (jika untuk B2B segment)

### Milestone 7 — Notifikasi, Review, polish (Minggu 7)
- [ ] Inbox notifikasi (`Notification` model)
- [ ] Review & rating produk pasca-delivered
- [ ] Email transaksional (Resend / Nodemailer)

### Milestone 8 — QA, Security & Deploy (Minggu 8)
- [ ] Unit test (Vitest) untuk service layer
- [ ] E2E test (Playwright) untuk happy path checkout
- [ ] Security review: SQL injection (parameterized via Prisma ✅), XSS, CSRF, rate limit
- [ ] Load test (k6) endpoint `/api/checkout`
- [ ] Deploy ke Vercel + claim TiDB Cloud (atau migrasi ke TiDB Starter)
- [ ] Dokumentasi user manual + dokumentasi teknis

---

## Risiko (dari proposal)

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Kegagalan API pihak ketiga (Midtrans/RajaOngkir) | Sedang | Tinggi | Fallback + retry + structured error logging |
| Inkonsistensi stok (race condition) | Rendah | Tinggi | DB transaction atomic untuk decrement stok di checkout |
| Kebocoran data | Rendah | Tinggi | Bcrypt password, env-only secret, audit endpoint |

## Database

- **TiDB Cloud Zero** sandbox (auto-expire 30 hari).
- Untuk production: claim instance via `claimUrl` agar jadi TiDB Starter (gratis 5 GiB) atau migrasi ke MySQL self-hosted.
- Kompatibilitas: MySQL 5.7/8.0 wire protocol → semua driver MySQL bekerja.
- Migration: `prisma db push` untuk dev; `prisma migrate dev/deploy` ketika sudah stabil.

## Deployment target

- **Frontend + API**: Vercel (Next.js native, preview deployment per-PR).
- **Database**: TiDB Cloud Starter (paling tidak hingga MVP rilis).
- **Asset/Image**: Vercel Blob atau Cloudinary.
- **Domain & SSL**: dipilih nanti (estimasi proposal: Rp150k/tahun + Rp200k SSL).
