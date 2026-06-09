import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

const PRODUCTS = [
  {
    slug: "madu-hutan-murni",
    name: "Madu Hutan Murni 500g",
    description: "Madu hutan mentah murni 100% organik dari pedalaman hutan tropis. Kaya antioksidan dan nutrisi alami tanpa pemrosesan kimia.",
    price: 125000.0,
    compareAt: 145000.0,
    stock: 50,
    weightGram: 600,
    category: "Obat Herbal",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "teh-chamomile-alami",
    name: "Teh Chamomile Alami (25 Kantong)",
    description: "Teh bunga chamomile kering pilihan berkualitas tinggi. Membantu menenangkan pikiran, mengurangi stres, dan meningkatkan kualitas tidur.",
    price: 45000.0,
    compareAt: 50000.0,
    stock: 100,
    weightGram: 100,
    category: "Teh & Seduhan",
    imageUrl:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "minyak-kayu-putih-ambon",
    name: "Minyak Kayu Putih Ambon 100ml",
    description: "Minyak kayu putih murni dari Kepulauan Ambon. Efektif menghangatkan tubuh, meredakan perut kembung, dan meredakan gatal akibat gigitan serangga.",
    price: 75000.0,
    compareAt: 85000.0,
    stock: 75,
    weightGram: 150,
    category: "Minyak Atsiri",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "kapsul-ekstrak-kunyit",
    name: "Kapsul Ekstrak Kunyit Organik (60 Kapsul)",
    description: "Suplemen kapsul ekstrak kunyit murni yang kaya akan kurkumin. Baik untuk menjaga kesehatan pencernaan, meredakan peradangan, dan meningkatkan imun tubuh.",
    price: 60000.0,
    compareAt: 70000.0,
    stock: 40,
    weightGram: 80,
    category: "Suplemen Alami",
    imageUrl:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "jahe-merah-bubuk",
    name: "Jahe Merah Bubuk Murni 200g",
    description: "Bubuk jahe merah kering murni berkualitas premium tanpa campuran gula. Bermanfaat untuk melancarkan sirkulasi darah, meredakan pegal linu, dan menghangatkan tubuh.",
    price: 35000.0,
    compareAt: 40000.0,
    stock: 120,
    weightGram: 220,
    category: "Rempah Pilihan",
    imageUrl:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
  },
];

async function main() {
  console.log("[seed] clearing existing database data...");
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // ── Users ──────────────────────────────────────────────────────────────────
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
      name: "HerbalStore Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      email: customerEmail,
      name: "Pelanggan Demo",
      passwordHash: await bcrypt.hash(customerPassword, 10),
      role: "CUSTOMER",
    },
  });

  console.log("[seed] users ensured:", adminEmail, customerEmail);

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoryNames = [
    "Obat Herbal",
    "Teh & Seduhan",
    "Minyak Atsiri",
    "Suplemen Alami",
    "Rempah Pilihan",
  ];

  const categoryMap: Record<string, string> = {};
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    categoryMap[name] = cat.id;
  }

  console.log("[seed] categories ensured");

  // ── Products ───────────────────────────────────────────────────────────────
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        compareAt: p.compareAt ?? null,
        stock: p.stock,
        status: "ACTIVE",
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt ?? null,
        stock: p.stock,
        weightGram: p.weightGram,
        status: "ACTIVE",
        categoryId: categoryMap[p.category],
      },
    });

    // Ensure primary image exists
    const imgCount = await prisma.productImage.count({
      where: { productId: product.id },
    });
    if (imgCount === 0) {
      await prisma.productImage.create({
        data: { productId: product.id, url: p.imageUrl, alt: p.name, position: 0 },
      });
    } else {
      // Update existing image URL to the new Unsplash URL
      const firstImage = await prisma.productImage.findFirst({
        where: { productId: product.id },
        orderBy: { position: "asc" }
      });
      if (firstImage) {
        await prisma.productImage.update({
          where: { id: firstImage.id },
          data: { url: p.imageUrl, alt: p.name }
        });
      }
    }
  }

  console.log("[seed] products ensured:", PRODUCTS.length);
}

main()
  .catch((err) => {
    console.error("[seed] failed", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
