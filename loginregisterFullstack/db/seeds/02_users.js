/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) { 
  await knex('users').del();
  
  // Don't specify id - let auto-increment handle it and put in the two first default dummy database developement users
  await knex('users').insert([
    {username: 'Admin_Everywhere', password: 'pass', department: 'Software Engineering', role: 1},
    {username: 'Regular_Joe', password: 'pass', department: 'user', role: 2}
  ]);
  
  console.log("\n== Seed data for users table added. ==\n");
};
