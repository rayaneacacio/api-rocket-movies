const { Router } = require("express");

const TagsController = require("../controllers/tags-controller");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const tagsRoutes = Router();
const tagsController = new TagsController();

tagsRoutes.post("/", ensureAuthenticated, tagsController.index);
tagsRoutes.post("/delete", ensureAuthenticated, tagsController.delete);

module.exports = tagsRoutes;