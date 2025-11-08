require("dotenv").config();

const server = require("./api/server.js");

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('weareusers').select('*');
    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }
};


const port = process.env.DEV_PORT || 5075;
server.listen(port, '0.0.0.0', () => console.log(`\n** Running on port ${port} **\n`));
