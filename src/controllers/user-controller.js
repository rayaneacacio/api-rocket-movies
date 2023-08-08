const { hash, compare } = require("bcryptjs");

const sqliteConnection = require('../database/sqlite');
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");
const knex = require("../database/knex");
const searchOldFiles = require("../providers/SearchOldFiles.js");
const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UserController{
  async create(request, response){
    const { name, email, password } = request.body;

    const userRepository = new UserRepository;
    const userCreateService = new UserCreateService(userRepository);
    await userCreateService.execute({ name, email, password });

    return response.status(201).json();
  }

  async update(request, reponse){
    const { id }  = request.user;
    const { name, email, oldPassword, newPassword } = request.body;

    const database = await sqliteConnection();

    const userData = await database.get("SELECT * FROM users WHERE id = (?)", [ id ]);

    if(!oldPassword || oldPassword === "") {
      throw new AppError("Por favor digite a senha");
    }

    if(!(await compare(oldPassword, userData.password))){
      throw new AppError("Email e/ou senha incorreta");
    }

    if(email != userData.email){
      const allEmail = await database.all("SELECT email FROM users");
      const allEmailArray = allEmail.map(item => {
        return item.email;
      })

      if( allEmailArray.some(item => item === email) ){
        throw new AppError("O email já existe");
      }
    }

    const hashedNewPassword = null;
    if(newPassword && newPassword != "") {
      hashedNewPassword = await hash(newPassword, 8);
    }

    const saveNewName = name ?? userData.name;
    const saveNewEmail = email ?? userData.email;
    const saveNewPassword = hashedNewPassword ?? userData.password;

    await database.get("UPDATE users SET (name, email, password) = (?, ?, ?) WHERE id = (?)", [ saveNewName, saveNewEmail, saveNewPassword, id ]);

    return reponse.json();
  }

  async patchAvatar(request, response){
    const { id } = request.user;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();
    const user = await knex("users").where({ id }).first();

    if(!user) {
      throw new AppError("somente usuários autenticados podem mudar o avatar", 401);
    }

    const AllImages = await searchOldFiles();
    AllImages.map(async image => {
      if(parseInt(image) === id) {
        await diskStorage.deleteFile(image);
      }
    })

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await knex("users").update(user).where({ id });

    return response.json(user);
  }

  async delete(request, response){
    const { id } = request.user;

    const database = await sqliteConnection();

    await database.get("DELETE FROM users WHERE id = (?)", [ id ]);

    return response.json();  
  }
}

module.exports = UserController;