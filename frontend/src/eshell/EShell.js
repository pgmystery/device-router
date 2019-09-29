import React  from "react"
import SocketIO from "../components/socketio/SocketIO";

import EShellTerm from "./EShellTerm"


class EShell {
  constructor() {
    this.sessions = []
  }

  createSession({ namespace='eshell', query={}, termCallbacks={} }={}) {
    const newSession = {
      termInput: inputFunction => newSession.termInput = inputFunction,  // Crazy, but it works...
      term: null,

      connected: false,
      isRdy: false,

      connect: () => this.connectSession(newSession, { namespace, query }),
      disconnect: () => this.disconnectSession(newSession),
      remove: () => this.removeSession(newSession),
    }

    newSession.term = <EShellTerm
      input={newSession.termInput}
      output={data => this.send(newSession, data)}
      {...termCallbacks}  // only if I want to rewrite the parameters, its not in use yet
    />

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

  connectSession(session, { namespace='eshell', query={} }={}) {
    const socket = SocketIO({ namespace, query })
    session.socket = socket

    socket.on('connect', () => {
      console.log('ESHELL_SOCKET CONNECTED')
      session.connected = true

      socket.on('rdy', data => {
        console.log('RDY FROM DEVICE')

        // TODO: OVERRIDE IS NOT WOKRING :(
        // session = {
        //   ...session,
        //   ...data,
        // }
        for (let [key, value] of Object.entries(data)) {
          session[key] = value
        }

        session.isRdy = true
      })

      socket.on('msg', data => session.termInput(data.msg))
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
