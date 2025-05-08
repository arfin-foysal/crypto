const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Seed networks
 * @param {Array} currencies - Array of currencies to associate networks with
 * @returns {Promise<Array>} Array of created networks
 */
async function seedNetworks(currencies) {
  console.log("Seeding networks...");

  try {
    // Check if networks already exist
    const existingNetworks = await prisma.network.findMany();

    if (existingNetworks.length > 0) {
      console.log(
        `Found ${existingNetworks.length} existing networks, skipping seed.`,
      );
      return existingNetworks;
    }

    // Get currency IDs by code for reference
    const currencyMap = {};
    currencies.forEach((currency) => {
      currencyMap[currency.code] = currency.id;
    });

    // Define networks to create
    const networks = [
      // Bitcoin networks
      {
        name: "Base",
        code: "BASE",
        currency_id: currencyMap["USD"],
        order: 1,
        enable_extra_field: false,
        status: "ACTIVE",
      },
      {
        name: "Stella",
        code: "stella",
        currency_id: currencyMap["USD"],
        order: 2,
        enable_extra_field: false,
        status: "ACTIVE",
      },
    ];

    // Create networks
    const createdNetworks = [];

    // We need to use create instead of createMany because we need to convert currency_id to BigInt
    for (const network of networks) {
      const created = await prisma.network.create({
        data: {
          ...network,
          currency_id: BigInt(network.currency_id),
        },
      });
      createdNetworks.push(created);
    }

    console.log(`Created ${createdNetworks.length} networks.`);

    // Return all networks (including any that already existed)
    return await prisma.network.findMany({
      include: {
        currency: true,
      },
    });
  } catch (error) {
    console.error("Error seeding networks:", error);
    throw error;
  }
}

module.exports = seedNetworks;
