const UserRepositoryInMemory = require("../../repositories/UserRepositoryInMemory");
const SessionService = require("./SessionService");
const AppError = require("../../utils/AppError");

describe("SessionService", () => {
  let userRepositoryInMemory = null;
  let sessionService = null;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory;
    sessionService = new SessionService(UserRepositoryInMemory);
  });

  it("verifica se o email existe", async() => {
    const userTest = null;

    await expect(sessionService.validateEmail({ user: userTest })).rejects.toEqual(new AppError("email e/ou senha incorreta"));
  });

  it("verifica se a senha está correta", async() => {
    const user = {
      password: "123"
    }

    await expect(sessionService.comparePassword({ user, password: "456" })).rejects.toEqual(new AppError("email e/ou senha incorreta"))
  });

});

//testes automatizados para validar o email e verificar se a senha esta correta p/ user fazer login 