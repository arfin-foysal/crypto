const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Seed countries
 * @returns {Promise<Array>} Array of created countries
 */
async function seedCountries() {
  console.log("Seeding countries...");

  try {
    // Check if countries already exist
    const existingCountries = await prisma.country.findMany();

    if (existingCountries.length > 0) {
      console.log(
        `Found ${existingCountries.length} existing countries, skipping seed.`,
      );
      return existingCountries;
    }

    // Define countries to create
    const countries = [
      {
        name: "United States",
        code: "US",
        order_index: 1,
        status: "ACTIVE",
      },
      {
        name: "United Kingdom",
        code: "GB",
        order_index: 2,
        status: "ACTIVE",
      },
      {
        name: "Canada",
        code: "CA",
        order_index: 3,
        status: "ACTIVE",
      },
      {
        name: "Australia",
        code: "AU",
        order_index: 4,
        status: "ACTIVE",
      },
      {
        name: "Germany",
        code: "DE",
        order_index: 5,
        status: "ACTIVE",
      },
      {
        name: "France",
        code: "FR",
        order_index: 6,
        status: "ACTIVE",
      },
      {
        name: "Japan",
        code: "JP",
        order_index: 7,
        status: "ACTIVE",
      },
      {
        name: "China",
        code: "CN",
        order_index: 8,
        status: "ACTIVE",
      },
      {
        name: "India",
        code: "IN",
        order_index: 9,
        status: "ACTIVE",
      },
      {
        name: "Brazil",
        code: "BR",
        order_index: 10,
        status: "ACTIVE",
      },
    ];

    // Create countries
    const createdCountries = await prisma.country.createMany({
      data: countries,
      skipDuplicates: true,
    });

    console.log(`Created ${createdCountries.count} countries.`);

    // Return all countries (including any that already existed)
    return await prisma.country.findMany();
  } catch (error) {
    console.error("Error seeding countries:", error);
    throw error;
  }
}

module.exports = seedCountries;
