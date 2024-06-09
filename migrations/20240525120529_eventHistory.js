/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('eventHistory', function (table) {
        table.increments('id');
        table.integer('user_id').references("id").inTable("usersshield").onDelete("CASCADE");
        table.text('date');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable('eventHistory')
};
