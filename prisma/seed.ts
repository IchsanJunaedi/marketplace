import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/db";

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
}

main()
  .catch((err) => {
    console.error("[seed] failed", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
