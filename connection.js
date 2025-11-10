
// const knex = require('knex')({
//   client: 'pg',
//   connection: process.env.DATABASE_URL,
// });

// exports.handler = async (req, res) => {
//   try {
//     const users = await knex('users').select('*');
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// module.exports = knex();


const { createClient } = require('@supabase/supabase-js');
const knex = require('knex')({ client: 'pg', connection: process.env.DATABASE_URL });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { data: user } = await supabase.auth.getUser(token);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const profile = await knex('profiles').where('email', user.email).first();
  res.json({ user, profile });
};
