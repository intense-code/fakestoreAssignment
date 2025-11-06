/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments();
        tbl.string("username", 50).notNullable().unique().index();
        tbl.string("password", 150).notNullable();
        tbl.string("department", 50).notNullable();
        tbl
          .integer("role")
          .unsigned()
          .references("roles.id")
          .onDelete("RESTRICT")
          .onUpdate("CASCADE")
          .defaultTo(2);
        tbl.timestamp("created_at").defaultTo(knex.fn.now());
      });
    }
  });

    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
