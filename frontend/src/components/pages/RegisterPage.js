import React from "react"
import { connect } from 'react-redux'
import { register } from '../../actions/session'
import RegisterForm from './register/RegisterForm'

const mapStateToProps = ({ errors }) => ({
  errors
})

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user))
})

function Register({ errors, register }) {
  return <RegisterForm onSubmit={register} errors={errors}/>
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)
