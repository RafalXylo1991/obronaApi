/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('listHistory', function (table) {
        table.increments('id');
        table.integer('user_id').references("id").inTable("usersshield").onDelete("CASCADE");
        table.integer('list_id');
        table.text('date');
        table.boolean('isDone');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
