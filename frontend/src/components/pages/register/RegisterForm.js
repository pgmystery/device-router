import React from "react"
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import Wrapper from '../../utils/Wrapper'
import { ButtonSuccess } from '../../utils/Button'
import Label from '../../utils/Label'
import Input from '../../utils/Input'


function RegisterForm({ onSubmit, errors }) {
  function submitHandler(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    onSubmit(data)
  }

  return (
    <Wrapper>
      <p>{errors}</p>
      <RegisterFormStyled onSubmit={submitHandler}>
        <div>
          <Label>Username:</Label>
          <Input type="text" name="username" placeholder="Username" required autoFocus/>
        </div>

        <div>
          <Label>Password:</Label>
          <Input type="password" name="password" placeholder="Password" required/>
        </div>

        <div>
          <Label>Firstname:</Label>
          <Input type="text" name="firstname" placeholder="Firstname" required/>
        </div>

        <div>
          <Label>Secondname:</Label>
          <Input type="text" name="secondname" placeholder="Secondname" required/>
        </div>

        <div>
          <Label>E-Mail:</Label>
          <Input type="email" name="email" placeholder="E-Mail" required/>
        </div>

        <SubmitButton>Register</SubmitButton>
      </RegisterFormStyled>
      <Link to="/login">Login</Link>
    </Wrapper>
  )
}

const RegisterFormStyled = styled.form`
  display: grid;
  gap: 20px;
  margin-top: 20px
`

const SubmitButton = styled(ButtonSuccess)`
  margin-left: 0;
  margin-right: 0;
  font-size: 24px;
`


export default RegisterForm
