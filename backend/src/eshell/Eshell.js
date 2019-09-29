const EShellModel = require('../db/models/EShellModel')

function EShell() {
  let eshellSessions = []

  function createSession(data, callbackFunction) {
    EShellModel.create(data)
      .then(session => {
        eshellSessions = [...eshellSessions, session]
        res.json(session)
      })
      .catch(err => res.json(err))
  }

}


module.exports = EShell
