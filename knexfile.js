// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config()
module.exports = {
  development: {
    client: 'pg',
      connection: {
        user: 'postgres',
        password: 'xylo',
        database: 'obrona'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
