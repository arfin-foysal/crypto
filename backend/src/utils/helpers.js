// helpers.js

// Function for building search condition
function buildSearchCondition(searchTerm, fields) {
  if (!searchTerm || !fields?.length) return {};

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
      },
    })),
  };
}

// Function for dynamic filtering
function buildFilterCondition(filters = {}) {
  const whereCondition = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Convert string numbers to integers for status
      if (key === "status") {
        whereCondition[key] = value;
      } else {
        whereCondition[key] = value;
      }
    }
  });

  return whereCondition;
}

// Function for pagination
function buildPagination(page = 1, perPage = 10) {
  const perPageInt = Math.max(parseInt(perPage, 10), 1);
  const pageInt = Math.max(parseInt(page, 10), 1);
  const skip = (pageInt - 1) * perPageInt;
  return { skip, take: perPageInt, perPageInt, pageInt };
}

// Function for generating pagination metadata
function generatePaginationMetadata(req, currentPage, totalCount, perPageInt) {
  const totalPages = Math.ceil(totalCount / perPageInt);
  const lastPage = totalPages;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  // Build base URL with existing query params except page
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  const baseUrlParams = new URLSearchParams(url.search);
  baseUrlParams.delete("page"); // Remove page from base params
  const baseQueryString = baseUrlParams.toString();
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

  // Helper to build full URL with params
  const buildUrl = (page) => {
    if (!page) return null;
    const queryString = baseQueryString
      ? `${baseQueryString}&page=${page}`
      : `page=${page}`;
    return `${baseUrl}?${queryString}`;
  };

  // Generate numbered pagination links
  const links = [];

  // Previous link
  links.push({
    url: buildUrl(prevPage),
    label: "&laquo; Previous",
    active: false,
  });

  // Numbered pages
  for (let i = 1; i <= totalPages; i++) {
    links.push({
      url: buildUrl(i),
      label: i.toString(),
      active: i === currentPage,
    });
  }

  // Next link
  links.push({
    url: buildUrl(nextPage),
    label: "Next &raquo;",
    active: false,
  });

  return {
    current_page: currentPage,
    first_page_url: buildUrl(1),
    last_page: lastPage,
    last_page_url: buildUrl(lastPage),
    next_page_url: buildUrl(nextPage),
    prev_page_url: buildUrl(prevPage),
    path: baseUrl,
    from: totalCount === 0 ? 0 : (currentPage - 1) * perPageInt + 1,
    to: Math.min(currentPage * perPageInt, totalCount),
    total: totalCount,
    per_page: perPageInt,
    links,
  };
}
function normalizeQuery(query) {
  const q = { ...query };

  if (q.search) {
    q.page = 1;
  }

  return q;
}
module.exports = {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
};
