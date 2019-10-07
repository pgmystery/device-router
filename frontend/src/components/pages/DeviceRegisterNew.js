import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import Request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import { ButtonSuccess } from '../utils/Button'
import Label from '../utils/Label'
import Input from '../utils/Input'


function DeviceRegisterNew() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCreated, setIsCreated] = useState(false)

  function submitHandler(event) {
    event.preventDefault()
    if (!isSubmitted) {
      setIsSubmitted(true)

      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData)

      const request = new Request('/api/device/register')
      request.post({ data })
        .then(() => setIsCreated(true))
        .catch(err => {
          console.log(err)
          setIsSubmitted(false)
        })
    }
  }

  return (
    isCreated
      ? <Redirect to="/registerlist" />
      : <Wrapper>
          <DeviceRegisterNewForm onSubmit={submitHandler}>
            <div>
              <Label>Name</Label>
              <Input type="text" name="name" placeholder="Name" required autoFocus />
            </div>
            <div>
              <Label>Start-Date</Label>
              <Input type="Date" name="startDate" placeholder="Start-Date" required/>
            </div>
            <div>
              <Label>End-Date</Label>
              <Input type="Date" name="endDate" placeholder="End-Date" required/>
            </div>
            <SubmitButton>Create Register-Token</SubmitButton>
          </DeviceRegisterNewForm>
        </Wrapper>
  )
}

const DeviceRegisterNewForm = styled.form`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
`

const SubmitButton = styled(ButtonSuccess)`
  margin-left: 0;
  margin-right: 0;
  font-size: 24px;
`


export default DeviceRegisterNew
