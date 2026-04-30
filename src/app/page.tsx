import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          D2C Marketplace
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Personal Marketplace System
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Platform direct-to-consumer untuk satu toko: katalog, keranjang,
          checkout, pembayaran (Midtrans), pengiriman (RajaOngkir), dan
          dashboard admin. Dibangun dengan Next.js 16, Prisma, dan TiDB Cloud.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/storefront"
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
          >
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Storefront →
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              Katalog produk, detail, dan keranjang.
            </div>
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
          >
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Admin →
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              Inventaris, pesanan, dan laporan.
            </div>
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Setup belum selesai — lihat <code>roadmap.md</code> untuk progres.
        </p>
      </div>
    </main>
  );
}
