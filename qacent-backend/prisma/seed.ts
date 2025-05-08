import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        full_name: "superadmin",
        email: "superadmin@example.com",
        password: await bcrypt.hash("12345678", 10),
        role: "SUPERADMIN",
        status: "ACTIVE",
      },
      {
        full_name: "admin",
        email: "admin@example.com",
        password: await bcrypt.hash("12345678", 10),
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        full_name: "user",
        email: "user@example.com",
        password: await bcrypt.hash("12345678", 10),
        role: "USER",
        status: "ACTIVE",
      },
    ],
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
