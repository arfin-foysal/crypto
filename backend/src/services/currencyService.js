const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const {
  createCurrencySchema,
  updateCurrencySchema,
} = require("../validations/currencyValidation");
const { STATUS } = require("../constants/constant");

/**
 * Get all currencies with pagination, search, and filter
 * @param {Object} req - Request object
 * @returns {Object} Currencies with pagination metadata
 */
async function getAllCurrencies(req) {
  try {
    const {
      page = 1,
      perPage = 10,
      search,
      status,
      sort,
      order,
    } = normalizeQuery(req.query);
    const pageInt = parseInt(page, 10);
    const perPageInt = parseInt(perPage, 10);

    // Build search condition
    const searchCondition = buildSearchCondition(search, ["name", "code"]);

    // Build status filter condition
    const statusCondition = status ? { status } : {};

    // Combine conditions
    const whereCondition = {
      AND: [searchCondition, statusCondition],
    };

    // Count total records
    const totalCount = await prisma.currency.count({
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

    // Get currencies with pagination
    const currencies = await prisma.currency.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy,
    });

    // Format currencies for response
    const formattedCurrencies = currencies.map((currency) => ({
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
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
      data: formattedCurrencies,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve currencies: ${error.message}`);
  }
}

/**
 * Get active currencies for dropdown
 * @returns {Array} Active currencies
 */
async function getActiveCurrenciesDropdown() {
  try {
    const currencies = await prisma.currency.findMany({
      where: {
        status: STATUS.ACTIVE,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        image: true,
      },
    });

    // Format currencies for response
    return currencies.map((currency) => ({
      ...currency,
      id: currency.id.toString(),
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve active currencies: ${error.message}`);
  }
}

/**
 * Get a currency by ID
 * @param {string} id - Currency ID
 * @returns {Object} Currency
 */
async function getCurrencyById(id) {
  try {
    const currency = await prisma.currency.findUnique({
      where: { id: BigInt(id) },
    });

    if (!currency) {
      throw new Error("Currency not found");
    }

    // Format currency for response
    return {
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve currency: ${error.message}`);
  }
}

/**
 * Create a new currency
 * @param {Object} data - Currency data
 * @returns {Object} Created currency
 */
async function createCurrency(data) {
  try {
    // Validate currency data
    const { error } = createCurrencySchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Auto-generate currency code from name if not provided
    let currencyCode = null;
    if (data.name) {
      // Extract first 3 letters from each word and convert to uppercase
      currencyCode = data.name
        .split(" ")
        .map((word) => word.substring(0, 3).toUpperCase())
        .join("")
        .substring(0, 10); // Limit to 10 characters

      // Check if code already exists
      const existingCurrency = await prisma.currency.findFirst({
        where: { code: currencyCode },
      });

      // If code exists, append a random number
      if (existingCurrency) {
        const randomSuffix = Math.floor(Math.random() * 100);
        currencyCode = `${currencyCode.substring(0, 7)}${randomSuffix}`;
      }
    }

    // Create the currency
    const currency = await prisma.currency.create({
      data: {
        name: data.name,
        code: currencyCode,
        // image field is not needed
        usd_rate: data.usd_rate || 0.0,
        order: data.order || null,
        status: data.status || STATUS.ACTIVE,
      },
    });

    // Format the currency data for response
    return {
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
    };
  } catch (error) {
    throw new Error(`Failed to create currency: ${error.message}`);
  }
}

/**
 * Update a currency
 * @param {string} id - Currency ID
 * @param {Object} data - Currency data
 * @returns {Object} Updated currency
 */
async function updateCurrency(id, data) {
  try {
    // Validate currency data
    const { error } = updateCurrencySchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if currency exists
    const existingCurrency = await prisma.currency.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCurrency) {
      throw new Error("Currency not found");
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    // code is auto-generated and cannot be updated
    // image field is not needed
    if (data.usd_rate !== undefined) updateData.usd_rate = data.usd_rate;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.status !== undefined) updateData.status = data.status;

    // Update the currency
    const currency = await prisma.currency.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Format the currency data for response
    return {
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
    };
  } catch (error) {
    throw new Error(`Failed to update currency: ${error.message}`);
  }
}

/**
 * Update a currency's status
 * @param {string} id - Currency ID
 * @param {string} status - New status
 * @returns {Object} Updated currency
 */
async function updateCurrencyStatus(id, status) {
  try {
    // Check if currency exists
    const existingCurrency = await prisma.currency.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCurrency) {
      throw new Error("Currency not found");
    }

    // Update the currency status
    const currency = await prisma.currency.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    // Format the currency data for response
    return {
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
    };
  } catch (error) {
    throw new Error(`Failed to update currency status: ${error.message}`);
  }
}

/**
 * Delete a currency
 * @param {string} id - Currency ID
 * @returns {Object} Deleted currency
 */
async function deleteCurrency(id) {
  try {
    // Check if currency exists
    const existingCurrency = await prisma.currency.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCurrency) {
      throw new Error("Currency not found");
    }

    // Check if currency has related networks or user networks
    const relatedNetworks = await prisma.network.count({
      where: { currency_id: BigInt(id) },
    });

    const relatedUserNetworks = await prisma.userNetwork.count({
      where: { currency_id: BigInt(id) },
    });

    if (relatedNetworks > 0 || relatedUserNetworks > 0) {
      throw new Error(
        "Cannot delete currency with related networks or user networks",
      );
    }

    // Delete the currency
    const currency = await prisma.currency.delete({
      where: { id: BigInt(id) },
    });

    // Format the currency data for response
    return {
      ...currency,
      id: currency.id.toString(),
      usd_rate: parseFloat(currency.usd_rate),
    };
  } catch (error) {
    throw new Error(`Failed to delete currency: ${error.message}`);
  }
}

module.exports = {
  getAllCurrencies,
  getActiveCurrenciesDropdown,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  updateCurrencyStatus,
  deleteCurrency,
};
