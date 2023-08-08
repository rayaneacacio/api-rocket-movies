const NotesRepository = require("../repositories/NotesRepository");

class notesController{
  async create(request, response) {
    const user_id = request.user.id;
    const { title, description, scoring, tags } = request.body;

    const notesRepository = new NotesRepository;
    await notesRepository.createNote({ user_id, title, description, scoring, tags });

    return response.json();
  }

  async index(request, response) {
    const user_id = request.user.id;

    const notesRepository = new NotesRepository;
    const notes = await notesRepository.searchAllNotes({ user_id });
    
    return response.json(notes);
  }

  async show(request, response) {
    const user_id = request.user.id;
    const { title } = request.body;
    
    const notesRepository = new NotesRepository;
    const note = await notesRepository.searchNoteByTitle({ user_id, title });

    return response.json(note);
  }

  async update(request, response) {
    const user_id = request.user.id;
    const { note_id, title, description, scoring, tags } = request.body;

    const notesRepository = new NotesRepository;
    await notesRepository.updateNote({ user_id, note_id, title, description, scoring, tags });

    return response.json();
  }

  async delete(request, response) {
    const user_id = request.user.id;
    const { title, description } = request.body;
  
    const notesRepository = new NotesRepository;
    notesRepository.deleteNote({ user_id, title, description });

    return response.json();
  }
}

module.exports = notesController;