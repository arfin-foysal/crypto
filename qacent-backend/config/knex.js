// db/knex.js
const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_DATABASE || "crypto",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
  },
});

module.exports = db;
