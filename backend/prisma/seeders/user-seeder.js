const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

/**
 * Seed users
 * @param {number} count - Number of users to create
 * @returns {Promise<Array>} Array of created users
 */
async function seedUsers(count = 5) {
  console.log(`Seeding ${count} users...`);

  try {
    // Always ensure we have admin and regular user accounts
    const defaultUsers = [
      {
        full_name: "Super Admin",
        email: "superadmin@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "SUPERADMIN",
        status: "ACTIVE",
        balance: 1000.0,
      },
      {
        full_name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "ADMIN",
        status: "ACTIVE",
        balance: 1000.0,
      },
      {
        full_name: "Regular User",
        email: "user@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "USER",
        status: "ACTIVE",
        balance: 500.0,
      },
    ];

    // Check if these users already exist
    const existingAdminUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    const existingRegularUser = await prisma.user.findUnique({
      where: { email: "user@example.com" },
    });

    // Create default users if they don't exist
    if (!existingAdminUser) {
      await prisma.user.create({
        data: defaultUsers[0],
      });
      console.log("Created admin user.");
    } else {
      console.log("Admin user already exists.");
    }

    if (!existingRegularUser) {
      await prisma.user.create({
        data: defaultUsers[1],
      });
      console.log("Created regular user.");
    } else {
      console.log("Regular user already exists.");
    }

    // Check how many additional users we need to create
    const existingUserCount = await prisma.user.count();
    const additionalUsersNeeded = Math.max(0, count - existingUserCount);

    if (additionalUsersNeeded <= 0) {
      console.log(
        `Already have ${existingUserCount} users, no additional users needed.`,
      );
    } else {
      console.log(`Creating ${additionalUsersNeeded} additional users...`);

      // Generate random users
      const randomUsers = [];
      for (let i = 0; i < additionalUsersNeeded; i++) {
        randomUsers.push({
          full_name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: await bcrypt.hash("password123", 10),
          phone: faker.phone.number(),
          dob: faker.date
            .birthdate({ min: 18, max: 65, mode: "age" })
            .toISOString()
            .split("T")[0],
          address: faker.location.streetAddress(),
          role: "USER",
          status: faker.helpers.arrayElement(["PENDING", "ACTIVE"]),
          balance: parseFloat(faker.finance.amount(0, 1000, 2)),
        });
      }

      // Create random users
      if (randomUsers.length > 0) {
        await prisma.user.createMany({
          data: randomUsers,
          skipDuplicates: true,
        });
        console.log(`Created ${randomUsers.length} random users.`);
      }
    }

    // Return all users
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

module.exports = seedUsers;
