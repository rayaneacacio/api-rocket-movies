const { Router } = require("express");

const NotesController = require("../controllers/notes-controller");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.post("/", ensureAuthenticated, notesController.create);
notesRoutes.get("/index", ensureAuthenticated, notesController.index);
notesRoutes.post("/show", ensureAuthenticated, notesController.show);
notesRoutes.put("/", ensureAuthenticated, notesController.update);
notesRoutes.post("/delete", ensureAuthenticated, notesController.delete);

module.exports = notesRoutes;