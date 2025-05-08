const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const {
  createNetworkSchema,
  updateNetworkSchema,
} = require("../validations/networkValidation");
const { STATUS } = require("../constants/constant");

/**
 * Get all networks with pagination, search, and filter
 * @param {Object} req - Request object
 * @returns {Object} Networks with pagination metadata
 */
async function getAllNetworks(req) {
  try {
    const {
      page = 1,
      perPage = 10,
      search,
      status,
      sort,
      order,
      currency_id,
    } = normalizeQuery(req.query);
    const pageInt = parseInt(page, 10);
    const perPageInt = parseInt(perPage, 10);

    // Build search condition
    const searchCondition = buildSearchCondition(search, ["name", "code"]);

    // Build status filter condition
    const statusCondition = status ? { status } : {};

    // Build currency filter
    const currencyFilter = currency_id
      ? { currency_id: BigInt(currency_id) }
      : {};

    // Combine conditions
    const whereCondition = {
      AND: [searchCondition, statusCondition, currencyFilter],
    };

    // Count total records
    const totalCount = await prisma.network.count({
      where: whereCondition,
    });

    // Build pagination
    const { skip, take } = buildPagination(pageInt, perPageInt);

    // Build sort order
    const orderBy = {};
    if (sort && order) {
      orderBy[sort] = order.toLowerCase();
    } else {
      // Default sorting
      orderBy.id = "desc";
    }

    // Get networks with pagination
    const networks = await prisma.network.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy,
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format networks for response
    const formattedNetworks = networks.map((network) => ({
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    }));

    // Generate pagination metadata
    const pagination = generatePaginationMetadata(
      req,
      pageInt,
      totalCount,
      perPageInt,
    );

    return {
      ...pagination,
      data: formattedNetworks,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve networks: ${error.message}`);
  }
}

/**
 * Get active networks for dropdown
 * @param {string} currency_id - Optional currency ID to filter networks
 * @returns {Array} Active networks
 */
async function getActiveNetworksDropdown(currency_id) {
  try {
    const whereCondition = {
      status: STATUS.ACTIVE,
      ...(currency_id ? { currency_id: BigInt(currency_id) } : {}),
    };

    const networks = await prisma.network.findMany({
      where: whereCondition,
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        currency_id: true,
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format networks for response
    return networks.map((network) => ({
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve active networks: ${error.message}`);
  }
}

/**
 * Get a network by ID
 * @param {string} id - Network ID
 * @returns {Object} Network
 */
async function getNetworkById(id) {
  try {
    const network = await prisma.network.findUnique({
      where: { id: BigInt(id) },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!network) {
      throw new Error("Network not found");
    }

    // Format network for response
    return {
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to retrieve network: ${error.message}`);
  }
}

/**
 * Create a new network
 * @param {Object} data - Network data
 * @returns {Object} Created network
 */
async function createNetwork(data) {
  try {
    // Validate network data
    const { error } = createNetworkSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if currency exists
    const currency = await prisma.currency.findUnique({
      where: { id: BigInt(data.currency_id) },
    });

    if (!currency) {
      throw new Error("Currency not found");
    }

    // Auto-generate network code from name if not provided
    let networkCode = null;
    if (data.name) {
      // Extract first 3 letters from each word and convert to uppercase
      networkCode = data.name
        .split(" ")
        .map((word) => word.substring(0, 3).toUpperCase())
        .join("")
        .substring(0, 10); // Limit to 10 characters

      // Check if code already exists
      const existingNetwork = await prisma.network.findFirst({
        where: { code: networkCode },
      });

      // If code exists, append a random number
      if (existingNetwork) {
        const randomSuffix = Math.floor(Math.random() * 100);
        networkCode = `${networkCode.substring(0, 7)}${randomSuffix}`;
      }
    }

    // Create the network
    const network = await prisma.network.create({
      data: {
        name: data.name,
        code: networkCode,
        // image field is not needed
        currency_id: BigInt(data.currency_id),
        order: data.order || null,
        enable_extra_field:
          data.enable_extra_field !== undefined
            ? data.enable_extra_field
            : false,
        status: data.status || STATUS.ACTIVE,
      },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format the network data for response
    return {
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to create network: ${error.message}`);
  }
}

/**
 * Update a network
 * @param {string} id - Network ID
 * @param {Object} data - Network data
 * @returns {Object} Updated network
 */
async function updateNetwork(id, data) {
  try {
    // Validate network data
    const { error } = updateNetworkSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if network exists
    const existingNetwork = await prisma.network.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingNetwork) {
      throw new Error("Network not found");
    }

    // Check if currency exists if currency_id is provided
    if (data.currency_id) {
      const currency = await prisma.currency.findUnique({
        where: { id: BigInt(data.currency_id) },
      });

      if (!currency) {
        throw new Error("Currency not found");
      }
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    // code is auto-generated and cannot be updated
    // image field is not needed
    if (data.currency_id !== undefined)
      updateData.currency_id = BigInt(data.currency_id);
    if (data.order !== undefined) updateData.order = data.order;
    if (data.enable_extra_field !== undefined)
      updateData.enable_extra_field = data.enable_extra_field;
    if (data.status !== undefined) updateData.status = data.status;

    // Update the network
    const network = await prisma.network.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format the network data for response
    return {
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to update network: ${error.message}`);
  }
}

/**
 * Update a network's status
 * @param {string} id - Network ID
 * @param {string} status - New status
 * @returns {Object} Updated network
 */
async function updateNetworkStatus(id, status) {
  try {
    // Check if network exists
    const existingNetwork = await prisma.network.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingNetwork) {
      throw new Error("Network not found");
    }

    // Update the network status
    const network = await prisma.network.update({
      where: { id: BigInt(id) },
      data: { status },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format the network data for response
    return {
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to update network status: ${error.message}`);
  }
}

/**
 * Delete a network
 * @param {string} id - Network ID
 * @returns {Object} Deleted network
 */
async function deleteNetwork(id) {
  try {
    // Check if network exists
    const existingNetwork = await prisma.network.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingNetwork) {
      throw new Error("Network not found");
    }

    // Check if network has related user networks
    const relatedUserNetworks = await prisma.userNetwork.count({
      where: { network_id: BigInt(id) },
    });

    if (relatedUserNetworks > 0) {
      throw new Error("Cannot delete network with related user networks");
    }

    // Delete the network
    const network = await prisma.network.delete({
      where: { id: BigInt(id) },
      include: {
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format the network data for response
    return {
      ...network,
      id: network.id.toString(),
      currency_id: network.currency_id.toString(),
      currency: {
        ...network.currency,
        id: network.currency.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to delete network: ${error.message}`);
  }
}

module.exports = {
  getAllNetworks,
  getActiveNetworksDropdown,
  getNetworkById,
  createNetwork,
  updateNetwork,
  updateNetworkStatus,
  deleteNetwork,
};
