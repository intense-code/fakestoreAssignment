/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// knex migrate:make create_sessions
exports.up = async function (knex) {
  await knex.schema.createTable("sessions", (t) => {
    t.string("id").primary(); // jti (uuid)
    t.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.text("user_agent");
    t.text("ip");
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("last_seen_at").defaultTo(knex.fn.now());
    t.timestamp("expires_at").notNullable();
    t.timestamp("revoked_at").nullable();
  });

  // A view that shows currently "online" users (seen within 5 minutes, not revoked, not expired)
  await knex.raw(`
    CREATE VIEW online_users AS
    SELECT u.id AS user_id, u.username, s.last_seen_at
    FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.revoked_at IS NULL
      AND s.expires_at > CURRENT_TIMESTAMP
      AND s.last_seen_at > DATETIME('now','-5 minutes')
    GROUP BY u.id
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP VIEW IF EXISTS online_users`);
  await knex.schema.dropTableIfExists("sessions");
};
