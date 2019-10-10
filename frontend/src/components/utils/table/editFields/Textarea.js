import React, { useState } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import { ButtonSuccess } from '../../../utils/Button'
import Input from '../../../utils/Input'
import { TextSpan, IconButton } from '../Table'
import pencilIcon from '../../../images/pencil_icon.svg'


function Textarea({ text, onChanged }) {
  const [textValue, setTextValue] = useState(text)
  const [inputValue, setInputValue] = useState(text)
  const [onEditing, setOnEditing] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const value = event.currentTarget.textarea.value

    onChanged(value)

    setTextValue(value)
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
              <TextareaStyled
                type="text"
                name="textarea"
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

const TextareaStyled = styled.textarea`
  width: 100%;
`

const SubmitButton = styled(ButtonSuccess)`
  width: 100%;
  margin: 0;
`


export default Textarea