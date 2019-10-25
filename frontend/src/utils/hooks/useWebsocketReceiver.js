import { useEffect, useContext, useState } from 'react'
import { MainSocketContext } from '../../socketio/MainSocketContext'

function useWebsocketReceiver(channel, initValue=null) {
  const [response, setResponse] = useState(initValue)
  const { addMainSocketListener } = useContext(MainSocketContext)

  useEffect(() => {
    addMainSocketListener(channel, websocketCallback)
  }, [])

  function websocketCallback(result) {
    setResponse(result)
  }

  return response
}


export default useWebsocketReceiver
