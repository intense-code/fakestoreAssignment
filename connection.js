
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

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
exports.handler = async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = knex();