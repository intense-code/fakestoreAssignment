/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
      .createTable("roles", tbl => {
        tbl.increments();
        tbl.string("name", 6).notNullable().unique();
      })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
  return knex.schema.dropTableIfExists("roles")
};
