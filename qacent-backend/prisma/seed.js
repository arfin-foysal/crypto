const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import seeders
const seedCurrencies = require("./seeders/currency-seeder");
const seedNetworks = require("./seeders/network-seeder");
const seedCountries = require("./seeders/country-seeder");
const seedUsers = require("./seeders/user-seeder");
const seedBanks = require("./seeders/bank-seeder");
const seedUserNetworks = require("./seeders/user-network-seeder");
const seedTransactionFees = require("./seeders/transaction-fee-seeder");
const seedBalances = require("./seeders/balance-seeder");

/**
 * Main seed function that orchestrates all seeders
 */
async function main() {
  console.log("Starting main seed process...");

  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const seedType = args[0]; // The type of seed to run
    const count = args[1] ? parseInt(args[1]) : undefined; // Optional count parameter

    if (seedType === "currencies") {
      await seedCurrencies();
    } else if (seedType === "networks") {
      const currencies = await seedCurrencies();
      await seedNetworks(currencies);
    }
    // else if (seedType === "countries") {
    //   await seedCountries();
    // }
    else if (seedType === "users") {
      await seedUsers(count || 5);
    }
    // else if (seedType === "banks") {
    //   const users = await seedUsers(5);
    //   await seedBanks(users);
    // }
    // else if (seedType === "usernetworks") {
    //   const users = await seedUsers(5);
    //   const networks = await seedNetworks(await seedCurrencies());
    //   await seedUserNetworks(users, networks);
    // }
    else if (seedType === "transactionfees") {
      await seedTransactionFees();
    }
    // else if (seedType === "balances") {
    //   await seedBalances(count || 50);
    // }
    else {
      // Run all seeders in sequence
      console.log("Running all seeders...");

      // Step 1: Seed currencies
      const currencies = await seedCurrencies();
      console.log("Currencies seeded successfully.");

      // Step 2: Seed networks (depends on currencies)
      const networks = await seedNetworks(currencies);
      console.log("Networks seeded successfully.");

      // // Step 3: Seed countries
      // const countries = await seedCountries();
      // console.log("Countries seeded successfully.");

      // Step 4: Seed transaction fees
      const transactionFees = await seedTransactionFees();
      console.log("Transaction fees seeded successfully.");

      // Step 5: Seed users
      const users = await seedUsers(5);
      console.log("Users seeded successfully.");

      // // Step 6: Seed banks and bank accounts (depends on users)
      // const bankAccounts = await seedBanks(users);
      // console.log("Banks and bank accounts seeded successfully.");

      // // Step 7: Seed user networks (depends on users and networks)
      // const userNetworks = await seedUserNetworks(users, networks);
      // console.log("User networks seeded successfully.");

      // // Step 8: Seed balances/transactions (depends on currencies, networks, users)
      // const transactionCount = await seedBalances(50);
      // console.log("Balances/transactions seeded successfully.");

      console.log("\nSeed summary:");
      console.log(`- Currencies: ${currencies.length}`);
      console.log(`- Networks: ${networks.length}`);
      // console.log(`- Countries: ${countries.length}`);
      console.log(`- Transaction Fees: ${transactionFees.length}`);
      console.log(`- Users: ${users.length}`);
      // console.log(`- Bank Accounts: ${bankAccounts.length}`);
      // console.log(`- User Networks: ${userNetworks.length}`);
      // console.log(`- Transactions: ${transactionCount}`);
    }

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Error during seed process:", error);
    throw error;
  }
}

// Run the main seed function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
