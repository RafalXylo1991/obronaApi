/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return  knex.schema.createTable('events', function (table) {
        table.increments('id');
        table.integer('user_id');
        table.text('title');
        table.text('startdate');
        table.text('enddate');
        table.text('starttime');
        table.text('endtime');
        table.text('description');
        table.text('timer');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
