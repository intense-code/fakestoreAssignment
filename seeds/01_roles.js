/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Delete users first to avoid foreign key constraint issues
  await knex('users').del();
  
  // Then delete roles
  await knex('roles').del();
  
  const roles = [
    {
      name: "admin", // will get id 1
    },
    {
      name: "user", // will get id 2
    },
  ];

  return knex("roles")
    .insert(roles)
    .then(() => console.log("\n== Seed data for roles table added. ==\n"));
};

 