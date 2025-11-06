const knex = require("knex");
const config = require("../knexfile.js");

const environment = process.env.NODE_ENV || "development";

// Add better connection pooling for SQLite
const dbConfig = {
  ...config[environment],
  pool: {
    min: 0,
    max: 1, // SQLite works better with single connection
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  acquireConnectionTimeout: 30000
};

module.exports = knex(dbConfig);