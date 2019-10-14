const EShellModel = require('../db/models/EShellModel')

class EShell {
  constructor() {
    this.eshellSessions = []
  }

  createSession(data, callbackFunction) {
    EShellModel.create(data)
      .then(session => {
        eshellSessions = [...eshellSessions, session]
        res.json(session)
      })
      .catch(err => res.json(err))
  }

}


module.exports = EShell
