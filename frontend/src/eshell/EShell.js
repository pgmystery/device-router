import SocketIO from '../socketio/SocketIO'


class EShell {
  constructor() {
    this.uniqueSessionId = 0
    this.sessions = []
    this.sendQueues = {}
  }

  createSession({ namespace='eshell', data }={}) {
    const newSession = {
      sessionId: this.uniqueSessionId++,

      input: inputFunction => newSession.input = inputFunction,  // Crazy, but it works...
      output: data => this.send({ session: newSession, data }),
      onWindowSizeChanged: (cols, rows) => this.send({ channel: 'term_size', session: newSession, data: {cols, rows} }),

      connected: false,
      isRdy: false,

      emit: data => this.send({ session: newSession, data }),
      connect: () => this.connectSession(newSession, namespace, data),
      disconnect: () => this.disconnectSession(newSession),
      remove: () => this.removeSession(newSession),
    }

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
      socket.emit('authenticate', {userId: data.userId, deviceId: data.deviceId})

      socket.on('authenticated', () => {
        session.connected = true

        socket.on('rdy', data => {
          for (const [key, value] of Object.entries(data)) {
            session[key] = value
          }
  
          session.isRdy = true

          if (this.sendQueues.hasOwnProperty(session)) {
            this.sendQueues[session].forEach(([ channel, data ]) => this.send({ channel, session, data }))
            delete this.sendQueues[session]
          }
        })
  
        socket.on('msg', data => session.input(data))
      })
    })

    return session.socket
  }

  disconnectSession(session) {
    session.socket.disconnect()
  }

  send({ channel='cmd', session, data }) {
    if (session.connected && session.isRdy) {
      session.socket.emit(channel, data)
    }
    else {
      this.sendQueues.hasOwnProperty(session)
        ? this.sendQueues[session].push([channel, data])
        : this.sendQueues[session] = [[channel, data]]
    }
  }
}

export default EShell
