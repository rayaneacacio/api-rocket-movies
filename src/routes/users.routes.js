const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/user-controller");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRouter = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRouter.post("/", usersController.create);
usersRouter.put("/", ensureAuthenticated, usersController.update);
usersRouter.patch("/", ensureAuthenticated, upload.single("avatar"), usersController.patchAvatar);
usersRouter.delete("/", ensureAuthenticated, usersController.delete);

module.exports = usersRouter;