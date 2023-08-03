const knex = require("../database/knex");

class notesController{
  async create(request, response) {
    const user_id = request.user.id;
    const { title, description, scoring, tags } = request.body;

    const [ note_id ] = await knex("notes").insert({
      user_id,
      title,
      description,
      scoring
    });

    if(tags.length > 0) {
      const tagsInsert = tags.map(name => {
        return {
          user_id,
          note_id,
          name
        }
      });

      await knex("tags").insert(tagsInsert);
    }

    return response.json();
  }

  async index(request, response) {
    const user_id = request.user.id;

    const notes = await knex("notes").where({ user_id });

    return response.json(notes);
  }

  async show(request, response) {
    const user_id = request.user.id;
    const { title } = request.body;
    
    const note = await knex("notes").where({ user_id })
    .whereLike('title', `%${title}%`);

    return response.json(note);
  }

  async update(request, response) {
    const user_id = request.user.id;
    const { note_id, title, description, scoring, tags } = request.body;

    const note = await knex("notes").where({ user_id, id: note_id });
    const note_tags = await knex("tags").select("name").where({ user_id, note_id });

    const newTitle = title ?? note.title;
    const newDescription = description ?? note.description;
    const newScoring = scoring ?? note.scoring;

    await knex("notes").update({ title: newTitle, description: newDescription, scoring: newScoring }).where({ user_id, id: note_id });

    const tagsListed = note_tags.map(note_tag => {return note_tag.name});
    for(let index = 0; index <= tags.length; index++) {
      if(tags.length > tagsListed.length) {
        if(tagsListed[index] != tags[index]) {
          const tagInsert = {
            user_id,
            note_id,
            name: tags[index]
          }

           await knex("tags").insert(tagInsert);
        }

      } else if(tags.length < tagsListed.length) {
        if(!(tags.includes(tagsListed[index]))) {
          await knex("tags").where({ user_id, note_id, name: tagsListed[index] }).delete();
        }

      }
    }

    return response.json();
  }

  async delete(request, response) {
    const user_id = request.user.id;
    const { title, description } = request.body;

    console.log(title, description)
    
    const [ note ] = await knex("notes").where({ user_id, title, description });

    await knex("notes").where({ id: note.id }).delete();

    return response.json();
  }
}

module.exports = notesController;