
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'sam', password: '123'},
        {username: 'tester', password: '123'},
      ]);
    });
};
