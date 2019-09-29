import React from "react"
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'


function RegisterForm({ onSubmit, errors }) {
  function submitHandler(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    onSubmit(data)
  }

  return (
    <>
      <p>{errors}</p>
      <RegisterFormStyled onSubmit={submitHandler}>
        <label>Username:</label>
        <input type="text" name="username" required autoFocus/>

        <label>Password:</label>
        <input type="password" name="password" required/>

        <label>Firstname:</label>
        <input type="text" name="firstname" required/>

        <label>Secondname:</label>
        <input type="text" name="secondname" required/>

        <label>E-Mail:</label>
        <input type="email" name="email" required/>

        <button>Register</button>
      </RegisterFormStyled>
      <Link to="/login">Login</Link>
    </>
  )
}

const RegisterFormStyled = styled.form`
  display: grid;
  gap: 20px;
`


export default RegisterForm
