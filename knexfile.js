// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config()
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: "dpg-coi1r6f79t8c738a82s0-a.frankfurt-postgres.render.com",
      user: 'xylo',
      password: 'aRVvfFFyrUyCxaxm9fcrXjlYDWz5Iurb',
      database: 'obrona_3g7k',
      ssl: true
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
