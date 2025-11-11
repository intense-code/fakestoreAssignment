require("dotenv").config();

const server = require("./server.js");

// Serverless handler (kept for Vercel / serverless deployments)
// Using direct database connection instead of Supabase client to avoid dependency issues
async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Use Knex for database queries instead of Supabase client
      const db = require("../connection.js");
      const data = await db('users').select('*');
      return res.status(200).json(data);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // For other HTTP methods, just return the Express app response
  return server(req, res);
}

// If this file is run directly (`node api/index.js`) start the Express app.
if (require.main === module) {
  const port = process.env.PORT || process.env.DEV_PORT || 5075;
  server.listen(port, '0.0.0.0', () => console.log(`\n** Running on port ${port} **\n`));
} else {
  // Export the handler for serverless platforms
  module.exports = handler;
}
