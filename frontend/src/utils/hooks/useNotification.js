import { useEffect, useContext } from 'react'
import { MainSocketContext } from '../../socketio/MainSocketContext'


function useNotification(notificationCallback) {
  const { addMainSocketListeners } = useContext(MainSocketContext)

  useEffect(() => {
    addMainSocketListeners([
      ['notification', notificationCallback],
      ['notifications', newNotifications]
    ])
  }, [])

  function newNotifications(notifications) {
    notifications.forEach(notification => notificationCallback(notification))
  }
}


export default useNotification
