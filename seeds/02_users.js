/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) { 
  // Users were already deleted in 01_roles.js, so no need to delete again
  // This ensures proper order: delete users, delete roles, insert roles, insert users
  
  // Get the actual role IDs from the database
  const adminRole = await knex('roles').where('name', 'admin').first();
  const userRole = await knex('roles').where('name', 'user').first();
  
  // Don't specify id - let auto-increment handle it and put in the two first default dummy database developement users
  await knex('users').insert([
    {username: 'Admin_Everywhere', password: 'pass', department: 'Software Engineering', role: adminRole.id},
    {username: 'Regular_Joe', password: 'pass', department: 'user', role: userRole.id}
  ]);
  
  console.log("\n== Seed data for users table added. ==\n");
};
