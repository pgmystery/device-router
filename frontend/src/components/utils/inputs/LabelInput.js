import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import Input from '../Input'
import P from '../Paragraph'
import checkIcon from '../../images/checkIcon.svg'
import removeIcon from '../../images/deleteIcon.svg'


function LabelInput(props) {
  const { value, onEdit, placeholder, type, required } = props

  const [onEditing, setOnEditing] = useState(false)
  const [onChange, setOnChange] = useState(value)
  const [iconObject, setIconObject] = useState()

  const input = useRef(null)

  useEffect(() => {
    if (onEditing) {
      setOnChange(value)
    }
  }, [onEditing])

  useEffect(() => {
    if (iconObject) {
      setTimeout(() => {
        setIconObject()
      }, 5000);
    }
  }, [iconObject])

  function handleBlur() {
    callbackOnEdit(onChange)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOnEditing(false)
    }
    else if (event.key === 'Enter') {
      callbackOnEdit(onChange)
    }
  }

  async function callbackOnEdit(onChange) {
    if ((required && onChange.length > 0) || !required) {
      if (input.current.checkValidity()) {
        const isEdited = await onEdit(onChange)
        showIcon(isEdited)
      }
    }
    setOnEditing(false)
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

  function showIcon(isEdited) {
    if (isEdited) {
      setIconObject({
        icon: checkIcon,
        color: '#28a745',
      })
    }
    else if (isEdited === false) {
      setIconObject({
        icon: removeIcon,
        color: '#ef4a53',
      })
    }
  }

  return (
    <LabelInputStyled>
    {
      onEditing
        ? <Input
            {...props}
            value={onChange}
            onFocus={event => event.currentTarget.select()}
            onBlur={handleBlur}
            onChange={event => setOnChange(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            ref={input}
          />
        : <PStyled className={props.className} value={value} onClick={() => setOnEditing(!onEditing)} onFocus={() => setOnEditing(!onEditing)} tabIndex={0}>
            {
              value.length > 0
                ? getValue(value)
                : placeholder
            }
          </PStyled>
    }
    {
      iconObject && <Icon>
        <ReactSVG src={iconObject.icon} beforeInjection={svg => {
          svg.setAttribute('style', `width: 32px; height: 32px; fill: ${iconObject.color};`)
        }} />
      </Icon>
    }
    </LabelInputStyled>
  )
}

const LabelInputStyled = styled.div`
  position: relative;
`

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

const Icon = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`


export default LabelInput
