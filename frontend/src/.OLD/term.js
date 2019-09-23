import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import * as attach from 'xterm/lib/addons/attach/attach';

let eshellSessions = []

function Term() {
  const ioEndpoint = "http://127.0.0.1:3001"

  const [messageInputValue, setMessageInputValue] = useState('')

  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [socketMain, setSocketMain] = useState(io(ioEndpoint + '/main'))

  let termContainer = HTMLDivElement;
  const term = new Terminal();


  useEffect(() => {
    // Terminal.applyAddon(attach)

    // https://github.com/xtermjs/xterm.js/issues/1972
    // term.attach(ws)
    term.open(termContainer)
    term.onData(sendDataToDevice)

    // socket.emit('start')
    socketMain.on("connect", () => {
      console.log("connected to server!");
      // setConnectionState(socketMain.connected)
      socketMain.on('msg', msg => {
        console.log(msg)
      })
    })

    socketMain.on('disconnect', () => {
      console.log('DISCONNECTED!')
      setEshellConnectionStarted(false)
      // setConnectionState(socketMain.connected)
    })

    console.log("TEST")
  }, [])

  function startEshellConnection() {
    console.log("START ESHELL")
    // socketEshell = io(state.ioEndpoint + '/eshell');
    const query = {
      type: 'user',
      userToken: socketMain.id,
      deviceId: 0  // TODO: Need to change it to the real ID of the device
    }
    // const socketEshell = io(ioEndpoint + '/eshell', {query})
    // console.log(socketEshell)

    eshellSessions = [...eshellSessions, io(ioEndpoint + '/eshell', {query})]

    const socketEshell  = eshellSessions[eshellSessions.length - 1]

    // const socketEshell = eshellSessions2[eshellSessions2.length - 1]

    // console.log(eshellSessions2)

    socketEshell.on('connect', () => {
      console.log("ESHELL_SOCKET CONNECTED")

      socketEshell.on('rdy', eshellSession => {
        console.log('RDY FROM DEVICE!!!')
        console.log(eshellSession)
        console.log(eshellSessions)
        eshellSessions = eshellSessions.map(sessionData => {
          // console.log(sessionData)
          // console.log(socketEshell)
          if (sessionData === socketEshell) {
            eshellSession.user = socketEshell
            return eshellSession
          }
          return sessionData
        })
      })

      socketEshell.on('msg', getDataFromDevice)
    })

    // setEshellSessions([...eshellSessions, {session: socketEshell}])
    setEshellConnectionStarted(true)
  }

  function getDataFromDevice(data) {
    term.write(data.msg)
  }

  function sendDataToDevice(data) {
    console.log("SEND MESSAGE")

    const eshellSocket = eshellSessions[0].user  // TODO: Need to be changed!!!

    const eshellSessionId = eshellSessions.find(session => session.user === eshellSocket).id

    eshellSocket.emit('cmd', {
      sessionId: eshellSessionId,
      cmd: data,
    })
  }

  return (
    <div>
      <button
        onClick={startEshellConnection}
        style={{
          padding: 10,
          marginBottom: 10
        }}
        disabled={eshellConnectionStarted}
      >Start connection...</button>
      <div className="container" ref={ref => (termContainer = ref)}></div>
    </div>
  )
}

export default Term;
