import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Input from '../Input'
import P from '../Paragraph'


function LabelInput(props) {
  const { value, onEdit, placeholder, type, required } = props

  const [onEditing, setOnEditing] = useState(false)
  const [onChange, setOnChange] = useState(value)

  useEffect(() => {
    if (onEditing) {
      setOnChange(value)
    }
  }, [onEditing])

  function handleBlur() {
    callbackOnEdit(onChange)
    setOnEditing(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOnEditing(false)
    }
    else if (event.key === 'Enter') {
      callbackOnEdit(onChange)
      setOnEditing(false)
    }
  }

  function callbackOnEdit(onChange) {
    if ((required && onChange.length > 0) || !required) {
      onEdit(onChange)
    }
  }

  function getValue(value) {
    if (type.toLowerCase() === 'password'){
      let newValue = ''
  
      for (let i=0; i < value.length; i++) {
        newValue += '*'
      }
  
      return newValue
    }
    return value
  }

  return (
    onEditing
      ? <Input
          {...props}
          value={onChange}
          onFocus={event => event.currentTarget.select()}
          onBlur={handleBlur}
          onChange={event => setOnChange(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      : <PStyled className={props.className} value={value} onClick={() => setOnEditing(!onEditing)} onFocus={() => setOnEditing(!onEditing)} tabIndex={0}>
          {
            value.length > 0
              ? getValue(value)
              : placeholder
          }
        </PStyled>
  )
}

const PStyled = styled(P)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  font-size: 1em;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: text;
  color: ${({ value }) => { if (value.length === 0) return 'gray'}};

  :hover {
    border-bottom: 2px solid #e0e0e0;
  }
`


export default LabelInput
