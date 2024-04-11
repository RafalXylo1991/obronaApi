/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return  knex.schema.createTable('notices', function (table) {
        table.increments('id');
        table.integer('user_id');
        table.text('title');
        table.text('subject');
        table.text('description');
        table.bool('important');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable('notices')

};
