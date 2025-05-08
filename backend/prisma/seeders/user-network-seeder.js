const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Seed user networks
 * @param {Array} users - Array of users to associate networks with
 * @param {Array} networks - Array of networks to associate with users
 * @returns {Promise<Array>} Array of created user networks
 */
async function seedUserNetworks(users, networks) {
  console.log("Seeding user networks...");

  try {
    // Check if user networks already exist
    const existingUserNetworks = await prisma.userNetwork.count();

    if (existingUserNetworks > 0) {
      console.log(
        `Found ${existingUserNetworks} existing user networks, skipping seed.`,
      );
      return await prisma.userNetwork.findMany({
        include: {
          user: true,
          currency: true,
          network: true,
        },
      });
    }

    // Ensure we have users and networks
    if (!users || users.length === 0) {
      users = await prisma.user.findMany();
      if (users.length === 0) {
        throw new Error("No users found. Please seed users first.");
      }
    }

    if (!networks || networks.length === 0) {
      networks = await prisma.network.findMany({
        include: {
          currency: true,
        },
      });
      if (networks.length === 0) {
        throw new Error("No networks found. Please seed networks first.");
      }
    }

    // Create user networks
    const userNetworks = [];

    // Assign some networks to each user
    for (const user of users) {
      // Randomly select 1-3 networks for each user
      const networkCount = Math.floor(Math.random() * 3) + 1;
      const shuffledNetworks = [...networks].sort(() => 0.5 - Math.random());
      const selectedNetworks = shuffledNetworks.slice(0, networkCount);

      for (const network of selectedNetworks) {
        userNetworks.push({
          user_id: user.id,
          currency_id: network.currency_id,
          network_id: network.id,
          network_address: `${network.code}_${Math.random().toString(36).substring(2, 10)}`,
          link: `https://example.com/${network.code.toLowerCase()}/${Math.random().toString(36).substring(2, 10)}`,
          status_user: Math.random() > 0.3 ? "ACTIVE" : "PENDING",
          status_admin: Math.random() > 0.2 ? "ACTIVE" : "PENDING",
        });
      }
    }

    // Create user networks
    const createdUserNetworks = [];

    // We need to use create instead of createMany because we need to convert IDs to BigInt
    for (const userNetwork of userNetworks) {
      const created = await prisma.userNetwork.create({
        data: {
          ...userNetwork,
          user_id: BigInt(userNetwork.user_id),
          currency_id: BigInt(userNetwork.currency_id),
          network_id: BigInt(userNetwork.network_id),
        },
        include: {
          user: true,
          currency: true,
          network: true,
        },
      });
      createdUserNetworks.push(created);
    }

    console.log(`Created ${createdUserNetworks.length} user networks.`);

    return createdUserNetworks;
  } catch (error) {
    console.error("Error seeding user networks:", error);
    throw error;
  }
}

module.exports = seedUserNetworks;
