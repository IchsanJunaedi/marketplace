import bcrypt from "bcryptjs";

import { Prisma, ProductStatus } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/db";

const SAMPLE_CATEGORIES = [
  { slug: "laptops", name: "Laptops & Workstations" },
  { slug: "monitors", name: "Monitors & Displays" },
  { slug: "audio", name: "Audio & Headphones" },
  { slug: "infrastructure", name: "Server Infrastructure" },
];

const SAMPLE_PRODUCTS: Array<{
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number;
  stock: number;
  categorySlug: string;
  imageUrl: string;
}> = [
  {
    slug: "latitude-7420-enterprise-notebook",
    name: "Latitude 7420 Enterprise Notebook",
    description:
      "Tipis & ringan dengan i7 vPro, 16GB RAM, dan 512GB SSD NVMe. Cocok untuk fleet management perusahaan.",
    price: 1249.0,
    compareAt: 1499.0,
    stock: 24,
    categorySlug: "laptops",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJiKMniu0k7DHTnYurAWnrxEHhHQ6x3hjrQtrXnkDy_nqLTMVMNWkTmf7QT2b1TiGV4pb9xNK8cH8U6k6ixlb2_yw0BvKFAt0oIVgo3tyjbzkuS6YleqNfCZgAaZ0uiXGSOyOTYVSJjygeRndrBxVPEBG0FLuofbQDeu8Jy0ZNsqpOXedLns0k47WxspdcO1nl3as0LQLMWTvLgyMb9oK0s27lp3k8h49KiJ1D3WOQh9nX3_q13g9by1B-_8aqcfGOnwwvzbyRK4_F",
  },
  {
    slug: "odyssey-g9-49-curved-business-monitor",
    name: 'Odyssey G9 49" Curved Business Monitor',
    description:
      "Monitor curved super-ultra-wide 49 inci. Ideal untuk multitasking, dashboard finance, atau control room operasional.",
    price: 1199.99,
    stock: 12,
    categorySlug: "monitors",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjnm94DbTcuxcGqCWHjwDlG0EoLnKwdm85pI8_-LoPn7-EjskWbTkagCPS3XoC6SHywyB1PinuYqShZOcvEXOBT7CtZS1GaE4zJal8ui4hyHZX4eDImxsT2oy6vC0Lh-42xz0FEm9nNVPxOsiIYgh0NxVGC3dWWnQ_ZuYW-y0Agf8E44H-etCgC5hylqDKjKtjHEMBFjsXWLQTRKebmYDm19Iiuw47riIEUND8FN7ZbwEPPogX3iHyFygBVUMwZ-jN0LHgRaOu1Pac",
  },
  {
    slug: "wh-1000xm5-noise-canceling-headphones",
    name: "WH-1000XM5 Noise Canceling Headphones",
    description:
      "Headphone over-ear flagship dengan ANC kelas industri, 30 jam battery, dan multipoint Bluetooth.",
    price: 348.0,
    stock: 5,
    categorySlug: "audio",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuiz9Er5_Tac1_4Vo5_EWCLVztubsax3qodazovErRPdtz_VSac-B0E1AW4aMILMXa-SDyJHghvhmZym3_u4B4tp_Ne7nEMUZgZpSML7MlST5C9W90gR9leSOjHdb0YoXdXRXm90KhwjqAb1Nd6uTOb8bXWw_jBWTIJ5oj7l5wfohKmPKH1QugwUjm-ksh_j1D0imWG1S5QlL0S2TSvJhb15tIcSKAARYxdT_iEnjY5Uan-d0G9Iy0_wXvkLTx-7jluYFeJGucMduw",
  },
  {
    slug: "edge-compute-node-cx-900",
    name: "Edge Compute Node CX-900",
    description:
      "1U rackmount server untuk edge compute & branch office. Dual 24-core CPU, 256GB ECC DDR5, 4x 10GbE SFP+.",
    price: 3499.0,
    compareAt: 3899.0,
    stock: 3,
    categorySlug: "infrastructure",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZa-wnC3l4ftVBCIHFxNhRXoedM9miJQk3gLJeYXYlBj3dZlPskTvyPMKdz6bgfp__xpqi-IjD5KZ8STLOMHo5IrDxQmCf34upnOU69mlYsS4PsiC0Qnr-F5VI-u55KyhYw3mSYFlRDyO0-DIlt1D7mM8U8ZhSF6vcYZPFlGVIeKnGorIkvm8VjjuJE0O-dC514vQXqRiihT9boOIf3eNJmAx3jLvbKsCCYyWByq8_l5l_ro8iO4lDJsclHp4ElXNQTBPNcjO77AnB",
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@enterprise.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";
  const customerEmail =
    process.env.SEED_CUSTOMER_EMAIL ?? "customer@enterprise.local";
  const customerPassword =
    process.env.SEED_CUSTOMER_PASSWORD ?? "customer1234";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "EnterpriseStore Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      email: customerEmail,
      name: "Demo Customer",
      passwordHash: await bcrypt.hash(customerPassword, 10),
      role: "CUSTOMER",
    },
  });

  console.log("[seed] users ensured:", adminEmail, customerEmail);

  const categoryBySlug = new Map<string, string>();
  for (const cat of SAMPLE_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryBySlug.set(cat.slug, row.id);
  }
  console.log("[seed] categories ensured:", SAMPLE_CATEGORIES.length);

  for (const sp of SAMPLE_PRODUCTS) {
    const categoryId = categoryBySlug.get(sp.categorySlug) ?? null;
    const product = await prisma.product.upsert({
      where: { slug: sp.slug },
      update: {
        name: sp.name,
        description: sp.description,
        price: new Prisma.Decimal(sp.price),
        compareAt:
          sp.compareAt == null ? null : new Prisma.Decimal(sp.compareAt),
        stock: sp.stock,
        categoryId,
        status: ProductStatus.ACTIVE,
      },
      create: {
        slug: sp.slug,
        name: sp.name,
        description: sp.description,
        price: new Prisma.Decimal(sp.price),
        compareAt:
          sp.compareAt == null ? null : new Prisma.Decimal(sp.compareAt),
        stock: sp.stock,
        categoryId,
        status: ProductStatus.ACTIVE,
      },
    });

    const existingPrimary = await prisma.productImage.findFirst({
      where: { productId: product.id, position: 0 },
    });
    if (existingPrimary) {
      if (existingPrimary.url !== sp.imageUrl) {
        await prisma.productImage.update({
          where: { id: existingPrimary.id },
          data: { url: sp.imageUrl },
        });
      }
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: sp.imageUrl, position: 0 },
      });
    }
  }
  console.log("[seed] products ensured:", SAMPLE_PRODUCTS.length);
}

main()
  .catch((err) => {
    console.error("[seed] failed", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
