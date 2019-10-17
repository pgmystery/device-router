import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/session'
import LoginForm from './login/LoginForm'
import { MainSocketContext } from '../../socketio/MainSocketContext'

const mapStateToProps = ({ errors }) => ({
  errors
})

const mapDispatchToProps = dispatch => ({
  login: (user, mainSocketState) => dispatch(login(user, mainSocketState))
})

function Login({ login, errors }) {
  const mainSocketState = useContext(MainSocketContext)
  return <LoginForm onSubmit={data => login(data, mainSocketState)} errors={errors}/>
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
