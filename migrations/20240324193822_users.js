/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('usersshield', function (table) {
    table.increments('id');
    table.string('name');
    table.string('password');
    table.string('email');
    table.integer('resetKey');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable('usersshield')
};
