const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const { STATUS } = require("../constants/constant");
const Auth = require("../utils/auth");

/**
 * Get all user networks for the authenticated user
 * @param {Object} req - Request object
 * @returns {Object} User networks with pagination metadata
 */
async function getUserNetworks(req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const {
      page = 1,
      perPage = 10,
      search,
      status_user,
      status_admin,
      currency_id,
      network_id,
    } = normalizeQuery(req.query);

    // Build search condition
    const searchCondition = buildSearchCondition(search, [
      "name",
      "network_address",
    ]);

    // Build filter conditions
    const filterCondition = buildFilterCondition({
      status_user,
      status_admin,
      currency_id: currency_id ? BigInt(currency_id) : undefined,
      network_id: network_id ? BigInt(network_id) : undefined,
    });

    // Combine conditions
    const whereCondition = {
      AND: [
        { user_id: userId }, // Only get networks for the authenticated user
        searchCondition,
        filterCondition,
      ].filter((condition) => Object.keys(condition).length > 0),
    };

    const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

    // Get user networks with pagination
    const [userNetworks, totalCount] = await Promise.all([
      prisma.userNetwork.findMany({
        where: whereCondition,
        orderBy: { created_at: "desc" },
        skip,
        take,
        include: {
          currency: {
            select: {
              id: true,
              name: true,
              code: true,
              image: true,
            },
          },
          network: {
            select: {
              id: true,
              name: true,
              code: true,
              image: true,
            },
          },
        },
      }),
      prisma.userNetwork.count({ where: whereCondition }),
    ]);

    // Format user networks for response
    const formattedUserNetworks = userNetworks.map((userNetwork) => ({
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    }));

    // Create pagination metadata
    return {
      current_page: pageInt,
      per_page: perPageInt,
      total: totalCount,
      from: totalCount === 0 ? 0 : (pageInt - 1) * perPageInt + 1,
      to: Math.min(pageInt * perPageInt, totalCount),
      last_page: Math.ceil(totalCount / perPageInt),
      data: formattedUserNetworks,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve user networks: ${error.message}`);
  }
}

/**
 * Get a user network by ID for the authenticated user
 * @param {string} id - User network ID
 * @param {Object} req - Request object
 * @returns {Object} User network
 */
async function getUserNetworkById(id, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userNetwork = await prisma.userNetwork.findUnique({
      where: { id: BigInt(id) },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    if (!userNetwork) {
      throw new Error("User network not found");
    }

    // Ensure the user network belongs to the authenticated user
    if (userNetwork.user_id.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to user network");
    }

    // Format user network for response
    return {
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve user network: ${error.message}`);
  }
}

/**
 * Create a new user network for the authenticated user
 * @param {Object} data - User network data
 * @param {Object} req - Request object
 * @returns {Object} Created user network
 */
async function createUserNetwork(data, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if currency exists
    const currency = await prisma.currency.findUnique({
      where: { id: BigInt(data.currency_id) },
    });

    if (!currency) {
      throw new Error("Currency not found");
    }

    // Check if network exists
    const network = await prisma.network.findUnique({
      where: { id: BigInt(data.network_id) },
    });

    if (!network) {
      throw new Error("Network not found");
    }

    // Check if network belongs to the currency
    if (network.currency_id.toString() !== data.currency_id) {
      throw new Error("Network does not belong to the selected currency");
    }

    // Check if user already has a network with the same currency and network
    const existingUserNetwork = await prisma.userNetwork.findFirst({
      where: {
        user_id: userId,
        currency_id: BigInt(data.currency_id),
        network_id: BigInt(data.network_id),
      },
    });

    if (existingUserNetwork) {
      throw new Error(
        "You already have a network with this currency and network",
      );
    }

    // Create the user network
    const userNetwork = await prisma.userNetwork.create({
      data: {
        user_id: userId,
        currency_id: BigInt(data.currency_id),
        network_id: BigInt(data.network_id),
        name: data.name || null,
        network_address: data.network_address || null,
        link: data.link || null,
        status_user: STATUS.ACTIVE,
        status_admin: STATUS.ACTIVE, // Admin status is always PENDING initially
      },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format user network for response
    return {
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to create user network: ${error.message}`);
  }
}

/**
 * Update a user network for the authenticated user
 * @param {string} id - User network ID
 * @param {Object} data - User network data
 * @param {Object} req - Request object
 * @returns {Object} Updated user network
 */
async function updateUserNetwork(id, data, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user network exists
    const existingUserNetwork = await prisma.userNetwork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUserNetwork) {
      throw new Error("User network not found");
    }

    // Ensure the user network belongs to the authenticated user
    if (existingUserNetwork.user_id.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to user network");
    }

    // Check if currency exists if provided
    if (data.currency_id) {
      const currency = await prisma.currency.findUnique({
        where: { id: BigInt(data.currency_id) },
      });

      if (!currency) {
        throw new Error("Currency not found");
      }
    }

    // Check if network exists if provided
    if (data.network_id) {
      const network = await prisma.network.findUnique({
        where: { id: BigInt(data.network_id) },
      });

      if (!network) {
        throw new Error("Network not found");
      }

      // Check if network belongs to the currency
      const currencyId =
        data.currency_id || existingUserNetwork.currency_id.toString();
      if (network.currency_id.toString() !== currencyId) {
        throw new Error("Network does not belong to the selected currency");
      }
    }

    // Check if user already has a network with the same currency and network
    if (data.currency_id || data.network_id) {
      const existingNetwork = await prisma.userNetwork.findFirst({
        where: {
          user_id: userId,
          currency_id: data.currency_id
            ? BigInt(data.currency_id)
            : existingUserNetwork.currency_id,
          network_id: data.network_id
            ? BigInt(data.network_id)
            : existingUserNetwork.network_id,
          id: { not: BigInt(id) }, // Exclude the current network
        },
      });

      if (existingNetwork) {
        throw new Error(
          "You already have a network with this currency and network",
        );
      }
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.currency_id !== undefined)
      updateData.currency_id = BigInt(data.currency_id);
    if (data.network_id !== undefined)
      updateData.network_id = BigInt(data.network_id);
    if (data.name !== undefined) updateData.name = data.name;
    if (data.network_address !== undefined)
      updateData.network_address = data.network_address;
    if (data.link !== undefined) updateData.link = data.link;
    if (data.status_user !== undefined)
      updateData.status_user = data.status_user;

    // Update the user network
    const userNetwork = await prisma.userNetwork.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format user network for response
    return {
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to update user network: ${error.message}`);
  }
}

/**
 * Update a user network's status for the authenticated user
 * @param {string} id - User network ID
 * @param {string} status - New status
 * @param {Object} req - Request object
 * @returns {Object} Updated user network
 */
async function updateUserNetworkStatus(id, status, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user network exists
    const existingUserNetwork = await prisma.userNetwork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUserNetwork) {
      throw new Error("User network not found");
    }

    // Ensure the user network belongs to the authenticated user
    if (existingUserNetwork.user_id.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to user network");
    }

    // Update the user network status
    const userNetwork = await prisma.userNetwork.update({
      where: { id: BigInt(id) },
      data: { status_user: status },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format user network for response
    return {
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to update user network status: ${error.message}`);
  }
}

/**
 * Delete a user network for the authenticated user
 * @param {string} id - User network ID
 * @param {Object} req - Request object
 * @returns {Object} Deleted user network
 */
async function deleteUserNetwork(id, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user network exists
    const existingUserNetwork = await prisma.userNetwork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUserNetwork) {
      throw new Error("User network not found");
    }

    // Ensure the user network belongs to the authenticated user
    if (existingUserNetwork.user_id.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to user network");
    }

    // Check if user network has related balances
    const relatedBalances = await prisma.balance.count({
      where: { user_network_id: BigInt(id) },
    });

    if (relatedBalances > 0) {
      throw new Error("Cannot delete user network with related transactions");
    }

    // Delete the user network
    const userNetwork = await prisma.userNetwork.delete({
      where: { id: BigInt(id) },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format user network for response
    return {
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to delete user network: ${error.message}`);
  }
}

/**
 * Get active networks for dropdown
 * @param {string} currency_id - Optional currency ID to filter networks by currency
 * @returns {Array} Array of active networks
 */
async function getActiveNetworksForDropdown(currency_id) {
  try {
    // Build where condition
    const whereCondition = {
      status: STATUS.ACTIVE,
      ...(currency_id && { currency_id: BigInt(currency_id) }),
    };

    // Get active networks
    const networks = await prisma.network.findMany({
      where: whereCondition,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format networks for response
    return networks.map((network) => ({
      id: network.id.toString(),
      name: network.name,
      code: network.code,
      image: network.image,
      currency_id: network.currency_id.toString(),
      currency: network.currency
        ? {
            id: network.currency.id.toString(),
            name: network.currency.name,
            code: network.currency.code,
            image: network.currency.image,
          }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve active networks: ${error.message}`);
  }
}

/**
 * Get all user networks for the authenticated user without pagination
 * @param {Object} req - Request object
 * @returns {Array} Array of user networks
 */
async function getAllUserNetworksWithoutPagination(req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get all user networks for the authenticated user
    const userNetworks = await prisma.userNetwork.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
      },
    });

    // Format user networks for response
    return userNetworks.map((userNetwork) => ({
      id: userNetwork.id.toString(),
      user_id: userNetwork.user_id.toString(),
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      name: userNetwork.name,
      network_address: userNetwork.network_address,
      link: userNetwork.link,
      status_user: userNetwork.status_user,
      status_admin: userNetwork.status_admin,
      created_at: userNetwork.created_at,
      updated_at: userNetwork.updated_at,
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
            image: userNetwork.network.image,
          }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve user networks: ${error.message}`);
  }
}

/**
 * Get user network addresses by network ID for dropdown
 * @param {string} network_id - Network ID to filter user networks
 * @param {Object} req - Request object
 * @returns {Array} Array of user network addresses
 */
async function getUserNetworkAddressesByNetworkId(network_id, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!network_id) {
      throw new Error("Network ID is required");
    }

    // Get user networks for the authenticated user filtered by network_id
    const userNetworks = await prisma.userNetwork.findMany({
      where: {
        user_id: userId,
        network_id: BigInt(network_id),
        status_user: STATUS.ACTIVE,
        status_admin: STATUS.ACTIVE,
      },
      orderBy: { created_at: "desc" },
      include: {
        network: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format user networks for response
    return userNetworks.map((userNetwork) => ({
      id: userNetwork.id.toString(),
      name: userNetwork.name || `Address ${userNetwork.id}`,
      network_address: userNetwork.network_address,
      network_id: userNetwork.network_id.toString(),
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
          }
        : null,
    }));
  } catch (error) {
    throw new Error(
      `Failed to retrieve user network addresses: ${error.message}`,
    );
  }
}

/**
 * Get user network addresses by currency ID for dropdown
 * @param {string} currency_id - Currency ID to filter user networks
 * @param {Object} req - Request object
 * @returns {Array} Array of user network addresses
 */
async function getUserNetworkAddressesByCurrencyId(currency_id, req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!currency_id) {
      throw new Error("Currency ID is required");
    }

    // Get user networks for the authenticated user filtered by currency_id
    const userNetworks = await prisma.userNetwork.findMany({
      where: {
        user_id: userId,
        currency_id: BigInt(currency_id),
        status_user: STATUS.ACTIVE,
        status_admin: STATUS.ACTIVE,
      },
      orderBy: { created_at: "desc" },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format user networks for response
    return userNetworks.map((userNetwork) => ({
      id: userNetwork.id.toString(),
      name: userNetwork.name || `Address ${userNetwork.id}`,
      network_address: userNetwork.network_address,
      currency_id: userNetwork.currency_id.toString(),
      network_id: userNetwork.network_id.toString(),
      currency: userNetwork.currency
        ? {
            id: userNetwork.currency.id.toString(),
            name: userNetwork.currency.name,
            code: userNetwork.currency.code,
            image: userNetwork.currency.image,
          }
        : null,
      network: userNetwork.network
        ? {
            id: userNetwork.network.id.toString(),
            name: userNetwork.network.name,
            code: userNetwork.network.code,
          }
        : null,
    }));
  } catch (error) {
    throw new Error(
      `Failed to retrieve user network addresses: ${error.message}`,
    );
  }
}

module.exports = {
  getUserNetworks,
  getUserNetworkById,
  createUserNetwork,
  updateUserNetwork,
  updateUserNetworkStatus,
  deleteUserNetwork,
  getActiveNetworksForDropdown,
  getAllUserNetworksWithoutPagination,
  getUserNetworkAddressesByNetworkId,
  getUserNetworkAddressesByCurrencyId,
};
