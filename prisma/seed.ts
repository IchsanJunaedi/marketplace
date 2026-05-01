import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

const PRODUCTS = [
  {
    slug: "latitude-7420-enterprise-notebook",
    name: "Latitude 7420 Enterprise Notebook",
    description: "Professional-grade laptop built for enterprise productivity.",
    price: 1249.0,
    compareAt: 1499.0,
    stock: 50,
    weightGram: 1800,
    category: "Laptops & Workstations",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJiKMniu0k7DHTnYurAWnrxEHhHQ6x3hjrQtrXnkDy_nqLTMVMNWkTmf7QT2b1TiGV4pb9xNK8cH8U6k6ixlb2_yw0BvKFAt0oIVgo3tyjbzkuS6YleqNfCZgAaZ0uiXGSOyOTYVSJjygeRndrBxVPEBG0FLuofbQDeu8Jy0ZNsqpOXedLns0k47WxspdcO1nl3as0LQLMWTvLgyMb9oK0s27lp3k8h49KiJ1D3WOQh9nX3_q13g9by1B-_8aqcfGOnwwvzbyRK4_F",
  },
  {
    slug: "odyssey-g9-curved-monitor",
    name: 'Odyssey G9 49" Curved Business Monitor',
    description: "Immersive ultra-wide curved monitor for power users.",
    price: 1199.99,
    compareAt: null,
    stock: 30,
    weightGram: 12000,
    category: "Monitors & Displays",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjnm94DbTcuxcGqCWHjwDlG0EoLnKwdm85pI8_-LoPn7-EjskWbTkagCPS3XoC6SHywyB1PinuYqShZOcvEXOBT7CtZS1GaE4zJal8ui4hyHZX4eDImxsT2oy6vC0Lh-42xz0FEm9nNVPxOsiIYgh0NxVGC3dWWnQ_ZuYW-y0Agf8E44H-etCgC5hylqDKjKtjHEMBFjsXWLQTRKebmYDm19Iiuw47riIEUND8FN7ZbwEPPogX3iHyFygBVUMwZ-jN0LHgRaOu1Pac",
  },
  {
    slug: "catalyst-9300-network-switch",
    name: "Catalyst 9300 48-port Network Switch",
    description: "Enterprise-grade managed network switch with PoE support.",
    price: 3450.0,
    compareAt: null,
    stock: 8,
    weightGram: 7500,
    category: "Networking Gear",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDLXKFnZ7nty988zIkJpFdvsPbgsoUYZmwW4OUR1oCUGwpD5rQdj3Kc9fqnsI5UPPUwb6z0fEB4WY21L605hQEMPgA4Lbx6Dre8B37aZrZPAe1Ijpg0eojmlWHsk6yenIFqGSegxg3rhHc7Dq4GYgzKcrNwIuWhIezoLtOfdPltaTvBT5fHmaG5pRoehYbBEesLv8PnFXrypMR7gbweq5ajjipH5YoFSEW0qVj4zfbKtF6pKCH3DMLK8s-rVVPoNqG9sMksQwlHZIB",
  },
  {
    slug: "mx-master-3s-wireless-mouse",
    name: "MX Master 3S Advanced Wireless Mouse",
    description: "Precision wireless mouse with ergonomic design.",
    price: 99.99,
    compareAt: null,
    stock: 200,
    weightGram: 141,
    category: "Peripherals",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ7ukrY5u1g-eCr8YAgcnjx69er-_Uczt1-9xYWBiosXhwJm2t-ye28h9d3SuOrTELvZ0EIxzdCHLCA6tXBwB0fmrwWrJn_pOJa1S3a7IPPrU8eU-SCmwMdXO-ToihEdYhTrafLuN-crmcW_ihr53bc79qkBfRricgEZEiEf6DkRIpgHl99L_rCrCa0AVxDdUZo1ivofuVo9dXr7SLnPFHkjyrq4AzKVHh1eH1DDufVlkG5el5Z4SrvTw2w5KrFC4-9N7-QX61K3fw",
  },
  {
    slug: "wh-1000xm5-headphones",
    name: "WH-1000XM5 Noise Canceling Headphones",
    description: "Industry-leading noise cancellation with 30-hr battery.",
    price: 348.0,
    compareAt: null,
    stock: 75,
    weightGram: 250,
    category: "Peripherals",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuiz9Er5_Tac1_4Vo5_EWCLVztubsax3qodazovErRPdtz_VSac-B0E1AW4aMILMXa-SDyJHghvhmZym3_u4B4tp_Ne7nEMUZgZpSML7MlST5C9W90gR9leSOjHdb0YoXdXRXm90KhwjqAb1Nd6uTOb8bXWw_jBWTIJ5oj7l5wfohKmPKH1QugwUjm-ksh_j1D0imWG1S5QlL0S2TSvJhb15tIcSKAARYxdT_iEnjY5Uan-d0G9Iy0_wXvkLTx-7jluYFeJGucMduw",
  },
  {
    slug: "poweredge-r750-server",
    name: "PowerEdge R750 Rack Server",
    description: "High-performance 2U rack server for demanding workloads.",
    price: 4199.0,
    compareAt: 5200.0,
    stock: 15,
    weightGram: 32000,
    category: "Server Components",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJiKMniu0k7DHTnYurAWnrxEHhHQ6x3hjrQtrXnkDy_nqLTMVMNWkTmf7QT2b1TiGV4pb9xNK8cH8U6k6ixlb2_yw0BvKFAt0oIVgo3tyjbzkuS6YleqNfCZgAaZ0uiXGSOyOTYVSJjygeRndrBxVPEBG0FLuofbQDeu8Jy0ZNsqpOXedLns0k47WxspdcO1nl3as0LQLMWTvLgyMb9oK0s27lp3k8h49KiJ1D3WOQh9nX3_q13g9by1B-_8aqcfGOnwwvzbyRK4_F",
  },
];

async function main() {
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

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoryNames = [
    "Laptops & Workstations",
    "Monitors & Displays",
    "Networking Gear",
    "Peripherals",
    "Server Components",
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
