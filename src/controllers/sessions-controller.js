const SessionsRepository = require("../repositories/SessionsRepository");
const SessionService = require("../services/session-services/SessionService");

class SessionsController{
  async create(request, response){
    const { email, password } = request.body;

    const sessionsRepository = new SessionsRepository;
    const user = await sessionsRepository.findUserByEmail({ email });

    const sessionService = new SessionService(sessionsRepository);
    const emailExist = await sessionService.validateEmail({ user });

    let token = null;

    if(emailExist) {
      token = await sessionService.comparePassword({ user, password });
    }

    return response.json({ user, token });
  }
}

module.exports = SessionsController;