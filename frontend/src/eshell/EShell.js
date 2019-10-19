import SocketIO from '../socketio/SocketIO'


class EShell {
  constructor() {
    this.sessions = []
  }

  createSession({ namespace='eshell', data, termCallbacks={} }={}) {
    const newSession = {
      input: inputFunction => newSession.input = inputFunction,  // Crazy, but it works...
      output: data => this.send(newSession, data),
      term: null,

      connected: false,
      isRdy: false,

      connect: () => this.connectSession(newSession, namespace, data),
      disconnect: () => this.disconnectSession(newSession),
      remove: () => this.removeSession(newSession),
    }

    console.log('termCallbacks', termCallbacks)

    this.sessions = [...this.sessions, newSession]

    return newSession
  }

  removeSession(session) {
    this.disconnectSession(session)

    const sessionId = this.sessions.indexOf(session)
    this.sessions = [
      ...this.sessions.slice(0, sessionId),
      ...this.sessions.slice(sessionId + 1)
    ]
  }

  connectSession(session, namespace='eshell', data) {
    const socket = SocketIO({ namespace, query: {type: 'user'} })
    session.socket = socket

    socket.on('connect', () => {
      console.log('ESHELL_SOCKET CONNECTED')
      console.log(data)
      socket.emit('authenticate', {userId: data.userId, deviceId: data.deviceId})

      socket.on('authenticated', () => {

        session.connected = true
  
        socket.on('rdy', data => {
          console.log('RDY FROM DEVICE')
  
          for (let [key, value] of Object.entries(data)) {
            session[key] = value
          }
  
          session.isRdy = true
        })
  
        socket.on('msg', data => session.input(data.msg))
      })
    })

    return session.socket
  }

  disconnectSession(session) {
    session.socket.disconnect()
  }

  send(session, data) {
    if (session.connected && session.isRdy) {
      session.socket.emit('cmd', {
        sessionId: session.id,
        cmd: data,
      })
    }
  }
}

export default EShell
