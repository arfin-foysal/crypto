const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const { STATUS } = require("../constants/constant");

/**
 * Get all countries with pagination, search, and filter
 * @param {Object} req - Request object
 * @returns {Object} Countries with pagination metadata
 */
async function getAllCountries(req) {
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
    const totalCount = await prisma.country.count({
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

    // Get countries with pagination
    const countries = await prisma.country.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy,
    });

    // Format the countries data for response
    const formattedCountries = countries.map((country) => ({
      ...country,
      id: country.id.toString(),
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
      data: formattedCountries,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve countries: ${error.message}`);
  }
}

/**
 * Get active countries for dropdown with search functionality
 * @param {Object} req - Request object containing search query
 * @returns {Array} Active countries filtered by search
 */
async function getActiveCountriesForDropdown(req) {
  try {
    const { search } = req?.query || {};

    // Build search condition
    const searchCondition = buildSearchCondition(search, ["name", "code"]);

    // Combine with active status condition
    const whereCondition = {
      AND: [{ status: STATUS.ACTIVE }, searchCondition],
    };

    const countries = await prisma.country.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        order_index: "asc",
      },
    });

    // Format the countries data for response
    return countries.map((country) => ({
      ...country,
      id: country.id.toString(),
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve active countries: ${error.message}`);
  }
}

/**
 * Get a country by ID
 * @param {string} id - Country ID
 * @returns {Object} Country
 */
async function getCountryById(id) {
  try {
    const country = await prisma.country.findUnique({
      where: { id: BigInt(id) },
    });

    if (!country) {
      throw new Error(`Country with ID ${id} not found`);
    }

    // Format the country data for response
    return {
      ...country,
      id: country.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve country: ${error.message}`);
  }
}

/**
 * Create a new country
 * @param {Object} data - Country data
 * @returns {Object} Created country
 */
async function createCountry(data) {
  try {
    // Create the country
    const country = await prisma.country.create({
      data: {
        name: data.name,
        code: data.code || null,
        order_index: data.order_index || null,
        status: data.status || STATUS.ACTIVE,
      },
    });

    // Format the country data for response
    return {
      ...country,
      id: country.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to create country: ${error.message}`);
  }
}

/**
 * Update a country
 * @param {string} id - Country ID
 * @param {Object} data - Country data
 * @returns {Object} Updated country
 */
async function updateCountry(id, data) {
  try {
    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCountry) {
      throw new Error(`Country with ID ${id} not found`);
    }

    // Update the country
    const country = await prisma.country.update({
      where: { id: BigInt(id) },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        code: data.code !== undefined ? data.code : undefined,
        order_index:
          data.order_index !== undefined ? data.order_index : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });

    // Format the country data for response
    return {
      ...country,
      id: country.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update country: ${error.message}`);
  }
}

/**
 * Update a country's status
 * @param {string} id - Country ID
 * @param {Object} data - Status data
 * @returns {Object} Updated country
 */
async function updateCountryStatus(id, data) {
  try {
    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCountry) {
      throw new Error(`Country with ID ${id} not found`);
    }

    // Update the country status
    const country = await prisma.country.update({
      where: { id: BigInt(id) },
      data: {
        status: data.status,
      },
    });

    // Format the country data for response
    return {
      ...country,
      id: country.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update country status: ${error.message}`);
  }
}

/**
 * Delete a country
 * @param {string} id - Country ID
 * @returns {Object} Deleted country
 */
async function deleteCountry(id) {
  try {
    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCountry) {
      throw new Error(`Country with ID ${id} not found`);
    }

    // Check if country has associated users
    const usersCount = await prisma.user.count({
      where: { country_id: BigInt(id) },
    });

    if (usersCount > 0) {
      throw new Error(
        `Cannot delete country with ID ${id} because it has associated users`,
      );
    }

    // Delete the country
    const country = await prisma.country.delete({
      where: { id: BigInt(id) },
    });

    // Format the country data for response
    return {
      ...country,
      id: country.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to delete country: ${error.message}`);
  }
}

module.exports = {
  getAllCountries,
  getActiveCountriesForDropdown,
  getCountryById,
  createCountry,
  updateCountry,
  updateCountryStatus,
  deleteCountry,
};
