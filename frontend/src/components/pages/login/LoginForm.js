import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import Wrapper from '../../utils/Wrapper'
import { ButtonSuccess } from '../../utils/Button'
import Label from '../../utils/Label'
import Input from '../../utils/Input'


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
    <Wrapper>
      <p>{errors}</p>
      <LoginFormStyled onSubmit={submitHandler}>
        <div>
          <Label>Username:</Label>
          <Input type="text" name='username' value={username} onChange={event => setUsername(event.currentTarget.value)} placeholder="Username" required autoFocus/>
        </div>
        <div>
          <Label>Password:</Label>
          <Input type="password" name='password' value={password} onChange={event => setPassword(event.currentTarget.value)} placeholder="Password" required />
        </div>
        <SubmitButton>Login</SubmitButton>
      </LoginFormStyled>
      <Link to="/register">Register</Link>
    </Wrapper>
  )
}

const LoginFormStyled = styled.form`
  display: grid;
  grid-gap: 20px;
  margin-top: 20px
`

const SubmitButton = styled(ButtonSuccess)`
  margin-left: 0;
  margin-right: 0;
  font-size: 24px;
`

export default LoginForm
