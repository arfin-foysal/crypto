const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Seed transaction fees
 * @returns {Promise<Array>} Array of created transaction fees
 */
async function seedTransactionFees() {
  console.log("Seeding transaction fees...");

  try {
    // Check if transaction fees already exist
    const existingFees = await prisma.transactionFee.findMany();

    if (existingFees.length > 0) {
      console.log(
        `Found ${existingFees.length} existing transaction fees, skipping seed.`,
      );
      return existingFees;
    }

    // Define transaction fees to create
    const fees = [
      {
        fee_type: "DEPOSIT",
        fee: 2,
      },
      {
        fee_type: "WITHDRAW",
        fee: 0,
      },
    ];

    // Create transaction fees
    const createdFees = await prisma.transactionFee.createMany({
      data: fees,
      skipDuplicates: true,
    });

    console.log(`Created ${createdFees.count} transaction fees.`);

    // Return all transaction fees (including any that already existed)
    return await prisma.transactionFee.findMany();
  } catch (error) {
    console.error("Error seeding transaction fees:", error);
    throw error;
  }
}

module.exports = seedTransactionFees;
