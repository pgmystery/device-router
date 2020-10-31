import React, { useState } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'
import dateConverter from '../../../../utils/dateConverter'

import { ButtonSuccess } from '../../../utils/Button'
import Input from '../../../utils/Input'
import { TextSpan, IconButton } from '../Table'
import calendarIcon from '../../../images/calendar_icon.svg'


function Date({ text, onChanged, name="date" }) {
  const [textValue, setTextValue] = useState(text)
  const [inputValue, setInputValue] = useState(dateConverter(text, 'na'))
  const [onEditing, setOnEditing] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const date = event.currentTarget[name].value

    if (date) {
      onChanged(date)

      setTextValue(dateConverter(date))
      setOnEditing(false)
    }
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
          ? <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Input
                type="date"
                name={name}
                onChange={event => setInputValue(event.currentTarget.value)}
                value={inputValue}
                onFocus={event => event.target.select()}
                autoFocus
              />
              <SubmitButton>Change</SubmitButton>
            </form>
          : <TextSpan onClick={() => setOnEditing(true)}>{textValue}</TextSpan>
      }
      <IconButton onClick={() => setOnEditing(!onEditing)} tooltip={'Change Date'}>
        <ReactSVG src={calendarIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
    </>
  )
}

const SubmitButton = styled(ButtonSuccess)`
  width: 100%;
  margin: 0;
`


export default Date
