/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
return knex.schema.createTable("users", tbl => {
        tbl.increments();
        tbl.string("username", 10).notNullable().unique().index();
        tbl.string("password", 10).notNullable();
        tbl.string("department", 10).notNullable();
        tbl
          .integer("role")
          .unsigned()
          .references("roles.id")
          .onDelete("RESTRICT")
          .onUpdate("CASCADE")
          .defaultTo(2);
        tbl.timestamp("created_at").defaultTo(knex.fn.now());
      });
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
