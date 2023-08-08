const { compare } = require("bcryptjs");

const AppError = require("../../utils/AppError");

class SessionService {
  constructor(sessionsRepository) {
    this.sessionsRepository = sessionsRepository;
  }

  async validateEmail({ user }) {
    if(!user) {
      throw new AppError("email e/ou senha incorreta", 400);
    }

    const emailExist = "email exist";

    return emailExist;
  }

  async comparePassword({ user, password }) {
    if(!(await compare(password, user.password))) {
      throw new AppError("email e/ou senha incorreta", 400);
    }

    const token = this.sessionsRepository.execute({ user });
    return token;
  }

}

module.exports = SessionService;