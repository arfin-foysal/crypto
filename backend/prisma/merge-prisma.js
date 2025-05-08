// merge-prisma.js
const fs = require("fs");
const path = require("path");

// Base schema content
const baseSchemaPath = path.join(__dirname, "base.prisma");
const baseSchema = fs.readFileSync(baseSchemaPath, "utf8");

// Get all model files
const modelsDir = path.join(__dirname, "models");
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".prisma"));

// Combine all models
let combinedSchema = baseSchema + "\n\n// Models\n";

modelFiles.forEach((file) => {
  const modelPath = path.join(modelsDir, file);
  const modelContent = fs.readFileSync(modelPath, "utf8");
  combinedSchema += "\n" + modelContent;
});

// Write to schema.prisma
const outputPath = path.join(__dirname, "schema.prisma");
fs.writeFileSync(outputPath, combinedSchema);

console.log("Schema files merged successfully!");

// Log the paths for debugging
console.log("Base Schema Path:", baseSchemaPath);
console.log("Models Directory:", modelsDir);
console.log("Output Path:", outputPath);
console.log("Found model files:", modelFiles);
