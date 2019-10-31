import { useEffect, useContext, useState } from 'react'
import { MainSocketContext } from '../../socketio/MainSocketContext'


function useMainSocket(channel, initValue=null) {
  const [response, setResponse] = useState(initValue)
  const { addMainSocketListener, mainSocket } = useContext(MainSocketContext)

  useEffect(() => {
    addMainSocketListener(channel, websocketCallback)
  }, [])

  function websocketCallback(result) {
    setResponse(result)
  }

  function emit(msg) {
    if (mainSocket) {
      mainSocket.emit(channel, msg)
      return true
    }

    return false
  }

  return [response, emit]
}


export default useMainSocket
