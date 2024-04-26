/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex('usersshield').insert([
        {
            'name': 'xylo',
            'password': '$1$zAX51wJu$T6wm9qaaBTstW6HY.k9Ma.',
            'email': 'xylohunter1991@gmail.com',
            'resetKey': null,

        },
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
