const knex = require("../database/knex");

class NotesRepository {
  async createNote({ user_id, title, description, scoring, tags }) {
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
  }

  async searchAllNotes({ user_id }) {
    const notes = await knex("notes").where({ user_id });
    return notes;
  }

  async searchNoteByTitle({ user_id, title }) {
    const note = await knex("notes").where({ user_id }).whereLike('title', `%${title}%`);
    return note;
  }

  async updateNote({ user_id, note_id, title, description, scoring, tags }) {
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
  }

  async deleteNote({ user_id, title, description }) {
    const [ note ] = await knex("notes").where({ user_id, title, description });

    await knex("notes").where({ id: note.id }).delete();
  }

}

module.exports = NotesRepository;