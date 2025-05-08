const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

/**
 * Seed banks and bank accounts
 * @param {Array} users - Array of users to associate bank accounts with
 * @returns {Promise<Array>} Array of created bank accounts
 */
async function seedBanks(users) {
  console.log("Seeding banks and bank accounts...");

  try {
    // Check if banks already exist
    const existingBanks = await prisma.bank.findMany();

    if (existingBanks.length === 0) {
      // Get currency IDs
      const currencies = await prisma.currency.findMany({
        where: {
          code: {
            in: ["USD", "EUR", "GBP"],
          },
        },
      });

      const currencyMap = {};
      currencies.forEach((currency) => {
        currencyMap[currency.code] = currency.id;
      });

      // Define banks to create
      const banks = [
        {
          name: "US National Bank",
          address: "123 Main St, New York, NY 10001",
          description: "Major US bank for USD transactions",
          account_type: "CHECKING",
          currency_id: currencyMap["USD"],
          ach_routing_no: "021000021",
          wire_routing_no: "021000021",
          status: "ACTIVE",
        },
        {
          name: "European Central Bank",
          address: "456 Euro Blvd, Frankfurt, Germany",
          description: "Major European bank for EUR transactions",
          account_type: "CHECKING",
          currency_id: currencyMap["EUR"],
          swift_code: "ECBFDEFF",
          status: "ACTIVE",
        },
        {
          name: "British Royal Bank",
          address: "789 Pound St, London, UK",
          description: "Major UK bank for GBP transactions",
          account_type: "CHECKING",
          currency_id: currencyMap["GBP"],
          sort_code: "123456",
          swift_code: "BRBGB2L",
          status: "ACTIVE",
        },
      ];

      // Create banks
      const createdBanks = [];

      // We need to use create instead of createMany because we need to convert currency_id to BigInt
      for (const bank of banks) {
        const created = await prisma.bank.create({
          data: {
            ...bank,
            currency_id: bank.currency_id ? BigInt(bank.currency_id) : null,
          },
        });
        createdBanks.push(created);
      }

      console.log(`Created ${createdBanks.length} banks.`);
    } else {
      console.log(
        `Found ${existingBanks.length} existing banks, skipping bank creation.`,
      );
    }

    // Get all banks for creating accounts
    const allBanks = await prisma.bank.findMany();

    // Check if bank accounts already exist
    const existingBankAccounts = await prisma.bankAccount.count();

    if (existingBankAccounts > 0) {
      console.log(
        `Found ${existingBankAccounts} existing bank accounts, skipping bank account creation.`,
      );
      return await prisma.bankAccount.findMany({
        include: {
          bank: true,
          user: true,
        },
      });
    }

    // Create bank accounts
    const bankAccounts = [];

    // Create some assigned accounts (with user_id)
    const assignedUsers = users.slice(0, Math.min(3, users.length));

    for (const user of assignedUsers) {
      // Assign one account per user
      const randomBank = allBanks[Math.floor(Math.random() * allBanks.length)];

      bankAccounts.push({
        user_id: user.id,
        bank_id: randomBank.id,
        routing_no: faker.finance.routingNumber(),
        account_number: faker.finance.accountNumber(10),
        is_open: true,
      });
    }

    // Create some unassigned accounts (null user_id) for future assignments
    for (let i = 0; i < 5; i++) {
      const randomBank = allBanks[Math.floor(Math.random() * allBanks.length)];

      bankAccounts.push({
        user_id: null,
        bank_id: randomBank.id,
        routing_no: faker.finance.routingNumber(),
        account_number: faker.finance.accountNumber(10),
        is_open: true,
      });
    }

    // Create bank accounts
    const createdBankAccounts = [];

    // We need to use create instead of createMany because we need to convert IDs to BigInt
    for (const account of bankAccounts) {
      const created = await prisma.bankAccount.create({
        data: {
          ...account,
          user_id: account.user_id ? BigInt(account.user_id) : null,
          bank_id: BigInt(account.bank_id),
        },
        include: {
          bank: true,
          user: true,
        },
      });
      createdBankAccounts.push(created);
    }

    console.log(`Created ${createdBankAccounts.length} bank accounts.`);

    return createdBankAccounts;
  } catch (error) {
    console.error("Error seeding banks and bank accounts:", error);
    throw error;
  }
}

module.exports = seedBanks;
