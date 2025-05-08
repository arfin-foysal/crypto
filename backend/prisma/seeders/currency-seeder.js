const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Seed currencies
 * @returns {Promise<Array>} Array of created currencies
 */
async function seedCurrencies() {
  console.log("Seeding currencies...");

  try {
    // Check if currencies already exist
    const existingCurrencies = await prisma.currency.findMany();

    if (existingCurrencies.length > 0) {
      console.log(
        `Found ${existingCurrencies.length} existing currencies, skipping seed.`,
      );
      return existingCurrencies;
    }

    // Define currencies to create
    const currencies = [
      {
        name: "USD",
        code: "USD",
        usd_rate: 1.0,
        order: 1,
        status: "ACTIVE",
      },
      {
        name: "USDC",
        code: "USDC",
        usd_rate: 1.0,
        order: 2,
        status: "ACTIVE",
      },
      {
        name: "Euro",
        code: "EUR",
        usd_rate: 1.25,
        order: 3,
        status: "ACTIVE",
      },
      {
        name: "British Pound",
        code: "GBP",
        usd_rate: 1.25,
        order: 3,
        status: "ACTIVE",
      },
    ];

    // Create currencies
    const createdCurrencies = await prisma.currency.createMany({
      data: currencies,
      skipDuplicates: true,
    });

    console.log(`Created ${createdCurrencies.count} currencies.`);

    // Return all currencies (including any that already existed)
    return await prisma.currency.findMany();
  } catch (error) {
    console.error("Error seeding currencies:", error);
    throw error;
  }
}

module.exports = seedCurrencies;
