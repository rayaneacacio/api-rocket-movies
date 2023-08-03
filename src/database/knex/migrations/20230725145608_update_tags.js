exports.up = knex => knex.schema.alterTable("tags", table => {
  table.text("name").nullable().alter();
});

exports.down = knex => knex.schema.alterTable("tags", table => {
  table.text("name").notNullable().alter();
});