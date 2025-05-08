const { PrismaClient, Decimal } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();

/**
 * Seed balances (transactions)
 * @param {number} count - Number of transactions to create
 * @returns {Promise<number>} Number of created transactions
 */
async function seedBalances(count = 50) {
  console.log(`Seeding ${count} transactions...`);

  try {
    // Check if transactions already exist
    const existingTransactions = await prisma.balance.count();

    if (existingTransactions > 0) {
      console.log(
        `Found ${existingTransactions} existing transactions, skipping seed.`,
      );
      return existingTransactions;
    }

    // Get users
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      throw new Error("No users found. Please seed users first.");
    }

    // Get currencies
    const currencies = await prisma.currency.findMany();
    if (currencies.length === 0) {
      throw new Error("No currencies found. Please seed currencies first.");
    }

    // Get networks
    const networks = await prisma.network.findMany();
    if (networks.length === 0) {
      throw new Error("No networks found. Please seed networks first.");
    }

    // Create transaction fees if they don't exist
    const existingFees = await prisma.transactionFee.findMany();
    if (existingFees.length === 0) {
      await prisma.transactionFee.createMany({
        data: [
          { fee_type: "DEPOSIT", fee: 5 },
          { fee_type: "WITHDRAW", fee: 10 },
        ],
      });
      console.log("Created transaction fees.");
    }

    // Get transaction fees
    const transactionFees = await prisma.transactionFee.findMany();
    const feeMap = {};
    transactionFees.forEach((fee) => {
      feeMap[fee.fee_type] = fee.fee;
    });

    // Create transactions
    const transactions = [];
    const transactionTypes = ["DEPOSIT", "WITHDRAW"];
    const statuses = [
      "PENDING",
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "IN_REVIEW",
    ];

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const transactionType =
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Select random currencies and networks
      const toCurrency =
        currencies[Math.floor(Math.random() * currencies.length)];
      const toNetworks = networks.filter(
        (n) => n.currency_id.toString() === toCurrency.id.toString(),
      );
      const toNetwork =
        toNetworks.length > 0
          ? toNetworks[Math.floor(Math.random() * toNetworks.length)]
          : null;

      const formCurrency =
        currencies[Math.floor(Math.random() * currencies.length)];
      const formNetworks = networks.filter(
        (n) => n.currency_id.toString() === formCurrency.id.toString(),
      );
      const formNetwork =
        formNetworks.length > 0
          ? formNetworks[Math.floor(Math.random() * formNetworks.length)]
          : null;

      // Generate random amount
      const amount = parseFloat(faker.finance.amount(10, 5000, 2));
      const feeAmount = feeMap[transactionType] || 0;
      const afterFeeAmount = amount - feeAmount;

      // Calculate after balance (simplified for seed data)
      const afterBalance =
        user.balance +
        (transactionType === "DEPOSIT" && status === "COMPLETED"
          ? afterFeeAmount
          : 0);

      transactions.push({
        uid: uuidv4(),
        transaction_id: faker.string.alphanumeric(10).toUpperCase(),
        charge_amount: feeAmount,
        fee_type: transactionType,
        fee_amount: feeAmount.toString(),
        amount: amount,
        after_fee_amount: afterFeeAmount,
        after_balance: afterBalance,
        transaction_type: transactionType,
        note: faker.lorem.sentence(),
        to_currency_id: toCurrency.id,
        to_network_id: toNetwork ? toNetwork.id : null,
        form_currency_id: formCurrency.id,
        form_network_id: formNetwork ? formNetwork.id : null,
        user_id: user.id,
        status: status,
      });
    }

    // Create transactions
    let createdCount = 0;

    // We need to use create instead of createMany because we need to convert IDs to BigInt
    for (const transaction of transactions) {
      await prisma.balance.create({
        data: {
          ...transaction,
          to_currency_id: transaction.to_currency_id
            ? BigInt(transaction.to_currency_id)
            : null,
          to_network_id: transaction.to_network_id
            ? BigInt(transaction.to_network_id)
            : null,
          form_currency_id: transaction.form_currency_id
            ? BigInt(transaction.form_currency_id)
            : null,
          form_network_id: transaction.form_network_id
            ? BigInt(transaction.form_network_id)
            : null,
          user_id: BigInt(transaction.user_id),
          amount: new Decimal(transaction.amount),
          after_fee_amount: new Decimal(transaction.after_fee_amount),
          after_balance: new Decimal(transaction.after_balance),
          charge_amount: new Decimal(transaction.charge_amount),
        },
      });
      createdCount++;
    }

    console.log(`Created ${createdCount} transactions.`);
    return createdCount;
  } catch (error) {
    console.error("Error seeding balances:", error);
    throw error;
  }
}

module.exports = seedBalances;
