/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return  knex.schema.createTable('lists', function (table) {
        table.increments('id');
        table.integer('user_id');
        table.text('title');
        table.text('date');
        table.json('tasks');
        table.boolean('isdone');
        table.integer('progress');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTable('lists')
};
