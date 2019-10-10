import React, { useState } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import { ButtonSuccess } from '../../../utils/Button'
import Input from '../../../utils/Input'
import { TextSpan, IconButton } from '../../DeviceRegisterPage'
import pencilIcon from '../../../images/pencil_icon.svg'


function Name({ id, text, onChanged }) {
  const [textValue, setTextValue] = useState(text)
  const [inputValue, setInputValue] = useState(text)
  const [onEditing, setOnEditing] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.currentTarget.name.value

    onChanged(id, {name})

    setTextValue(name)
    setOnEditing(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOnEditing(false)
    }
  }

  return (
    <>
      {
        onEditing
          ? <FormStyled onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Input
                type="text"
                name="name"
                onChange={event => setInputValue(event.currentTarget.value)}
                value={inputValue}
                onFocus={(event) => event.target.select()}
                autoFocus
              />
              <SubmitButton>Change</SubmitButton>
            </FormStyled>
          : <TextSpan>{textValue}</TextSpan>
      }
      <IconButton onClick={() => setOnEditing(!onEditing)}>
        <ReactSVG src={pencilIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
    </>
  )
}

const FormStyled = styled.form`
  width: 100%;
`

const SubmitButton = styled(ButtonSuccess)`
  width: 100%;
  margin: 0;
`


export default Name