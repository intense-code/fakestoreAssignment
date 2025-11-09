require("dotenv").config();

const server = require("./server.js");

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Serverless handler (kept for Vercel / serverless deployments)
async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('weareusers').select('*');
    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }
}

// If this file is run directly (`node api/index.js`) start the Express app.
if (require.main === module) {
  const port = process.env.PORT || process.env.DEV_PORT || 5075;
  server.listen(port, '0.0.0.0', () => console.log(`\n** Running on port ${port} **\n`));
} else {
  // Export the handler for serverless platforms
  module.exports = handler;
}
