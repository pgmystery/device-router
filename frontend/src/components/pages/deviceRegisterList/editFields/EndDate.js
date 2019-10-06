import React, { useState } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'
import dateConverter from '../../../../utils/dateConverter'

import { ButtonSuccess } from '../../../utils/Button'
import Input from '../../../utils/Input'
import { TextSpan, IconButton } from '../../DeviceRegisterPage'
import calendarIcon from '../../../images/calendar_icon.svg'


function EndDate({ id, text, onChanged }) {
  const [textValue, setTextValue] = useState(text)
  const [inputValue, setInputValue] = useState(dateConverter(text, 'na'))
  const [onEditing, setOnEditing] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const endDate = event.currentTarget.endDate.value

    if (endDate) {
      onChanged(id, {endDate})
  
      setTextValue(dateConverter(endDate))
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
                name="endDate"
                onChange={event => setInputValue(event.currentTarget.value)}
                value={inputValue}
                onFocus={(event) => event.target.select()}
                autoFocus
              />
              <SubmitButton>Change</SubmitButton>
            </form>
          : <TextSpan>{textValue}</TextSpan>
      }
      <IconButton onClick={() => setOnEditing(!onEditing)}>
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


export default EndDate
