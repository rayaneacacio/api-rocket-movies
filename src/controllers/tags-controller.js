const knex = require("../database/knex");

class TagsController{

  async index(request, response) {
    const user_id = request.user.id;
    const { note_id } = request.body;

    const tags = await knex("tags").where({ user_id, note_id });

    return response.json(tags);
  }

  async delete(request, response) {
    const user_id = request.user.id;
    const { title, name } = request.body;

    const [ note ] = await knex("notes").where({ title });
  
    await knex("tags").where({ user_id, note_id: note.id, name }).delete();
  
    return response.json();
  }
}

module.exports = TagsController;