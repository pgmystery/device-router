import React from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/session'
import LoginForm from './login/LoginForm'

const mapStateToProps = ({ errors }) => ({
  errors
})

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
})

function Login({ login, errors }) {
  return <LoginForm onSubmit={login} errors={errors}/>
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
