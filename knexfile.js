// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true, // SQLite does not support inserting default values, so we need to set this to true
        migrations: {
          directory: './db/migrations' // Path to your migration files
        },
        seeds: {
          directory: './db/seeds' // Path to your seed files
        }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port:process.env.DB_PORT,
      host:process.env.DB_HOST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
    tableName: 'knex_migrations',
    schemaName: 'staging',  // <--- new schema
    directory: './db/migrations',
  },
        seeds: {
          directory: './db/seeds' // Path to your seed files
        }
  },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
    tableName: 'knex_migrations',
    schemaName: 'production',  // <--- new schema
    directory: './migrations',
  },
        seeds: {
          directory: './seeds' // Path to your seed files
        }
  }
}