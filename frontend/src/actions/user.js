import { receiveErrors } from './error'

export const GET_USER_DATA = 'GET_USER_DATA'

const getUserData = user => {
  type: GET_USER_DATA,
  user
}

export const 
