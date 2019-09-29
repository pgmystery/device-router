import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

function LoginForm({ onSubmit, errors }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function submitHandler(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    data.username = username
    data.password = password

    onSubmit(data)
  }

  return (
    <>
      <p>{errors}</p>
      <LoginFormStyled onSubmit={submitHandler}>
        <label>Username:</label>
        <input type="text" name='username' value={username} onChange={event => setUsername(event.currentTarget.value)} required autoFocus/>
        <label>Password:</label>
        <input type="password" name='password' value={password} onChange={event => setPassword(event.currentTarget.value)} required />
        <button>Login</button>
      </LoginFormStyled>
      <Link to="/register">Register</Link>
    </>
  )
}

const LoginFormStyled = styled.form`
  display: grid;
  grid-gap: 10px;
`

export default LoginForm
