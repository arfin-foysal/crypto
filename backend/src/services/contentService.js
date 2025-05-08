const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  createContentSchema,
  updateContentSchema,
} = require("../validations/contentValidation");

/**
 * Get all content items
 * @returns {Array} All content items
 */
async function getAllContents() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return contents;
  } catch (error) {
    throw new Error(`Failed to fetch contents: ${error.message}`);
  }
}

/**
 * Get content by ID
 * @param {string} id - Content ID
 * @returns {Object} Content item
 */
async function getContentById(id) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: BigInt(id) },
    });

    if (!content) {
      throw new Error("Content not found");
    }

    // Format the content data for response
    return {
      ...content,
      id: content.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to fetch content: ${error.message}`);
  }
}

/**
 * Create new content
 * @param {Object} data - Content data
 * @returns {Object} Created content
 */
async function createContent(data) {
  try {
    // Validate content data
    const { error } = createContentSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Create the content
    const content = await prisma.content.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || "ACTIVE",
      },
    });

    // Format the content data with a simple structure
    return {
      id: content.id.toString(),
      name: content.name,
      description: content.description,
      status: content.status,
    };
  } catch (error) {
    throw new Error(`Failed to create content: ${error.message}`);
  }
}

/**
 * Update content
 * @param {string} id - Content ID
 * @param {Object} data - Content data to update
 * @returns {Object} Updated content
 */
async function updateContent(id, data) {
  try {
    // Validate content data
    const { error } = updateContentSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingContent) {
      throw new Error("Content not found");
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    // Update the content
    const content = await prisma.content.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Format the content data with a simple structure
    return {
      id: content.id.toString(),
      name: content.name,
      description: content.description,
      status: content.status,
    };
  } catch (error) {
    throw new Error(`Failed to update content: ${error.message}`);
  }
}

/**
 * Delete content
 * @param {string} id - Content ID
 * @returns {Object} Success message
 */
async function deleteContent(id) {
  try {
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingContent) {
      throw new Error("Content not found");
    }

    // Delete the content
    await prisma.content.delete({
      where: { id: BigInt(id) },
    });

    return { success: true, message: "Content deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete content: ${error.message}`);
  }
}

/**
 * Get content by multiple IDs
 * @param {Object|Array} idsParam - Content IDs (can be an array or an object with ids property)
 * @returns {Array} Content items as a simple array
 */
async function getContentByIds(idsParam) {
  try {
    // Handle different input formats
    let idsArray;

    if (Array.isArray(idsParam)) {
      // If idsParam is already an array
      idsArray = idsParam;
    } else if (typeof idsParam === "object" && idsParam.ids) {
      // If idsParam is an object with ids property
      idsArray = Array.isArray(idsParam.ids) ? idsParam.ids : [idsParam.ids];
    } else if (typeof idsParam === "string") {
      // If idsParam is a string, try to parse it as JSON
      try {
        const parsed = JSON.parse(idsParam);
        idsArray = Array.isArray(parsed)
          ? parsed
          : parsed.ids
          ? Array.isArray(parsed.ids)
            ? parsed.ids
            : [parsed.ids]
          : [];
      } catch {
        // If parsing fails, split by comma
        idsArray = idsParam.split(",").map((id) => id.trim());
      }
    } else {
      // Default to empty array if format is unrecognized
      idsArray = [];
    }

    // Filter out any non-numeric values and convert to BigInt
    const validIds = idsArray
      .filter((id) => id && !isNaN(Number(id)))
      .map((id) => BigInt(id));

    if (validIds.length === 0) {
      return [];
    }

    const contents = await prisma.content.findMany({
      where: {
        id: {
          in: validIds,
        },
      },
    });

    // Return a simple array of content objects with minimal fields
    return contents.map((content) => ({
      id: content.id.toString(),
      name: content.name,
      description: content.description,
      status: content.status,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch content: ${error.message}`);
  }
}

module.exports = {
  getAllContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentByIds,
};
