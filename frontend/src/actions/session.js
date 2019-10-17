import * as apiUtil from '../utils/session'
import { receiveErrors } from './error'
// import { MainSocketContext } from '../../socketio/MainSocketContext'
import { MainSocketContext } from '../socketio/MainSocketContext'

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER'
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER'

const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER,
  user
})

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
})

export const login = (user, mainSocketState, callback) => async dispatch => {
  const mainSocket = apiUtil.login(user, mainSocketState)
  console.log('mainSocket', mainSocket)

  mainSocket.on('connect', () => {
    console.log('connected')
    mainSocket.emit('authenticate', user)
  })

  mainSocket.on('authenticated', data => {
    const setMainSocket = mainSocketState[1]
    setMainSocket(mainSocket)
    console.log(data)
    callback(dispatch(receiveCurrentUser(data)))
  })
}

export const register = user => async dispatch => {
  const response = await apiUtil.register(user)
  const data = await response.json()

  if (response.ok) {
    return dispatch(receiveCurrentUser(data))
  }
  return dispatch(receiveErrors(data))
}

export const logout = () => async dispatch => {
  const response = await apiUtil.logout()
  const data = await response.json()

  if (response.ok) {
    return dispatch(logoutCurrentUser())
  }
  return dispatch(receiveErrors(data))
}
