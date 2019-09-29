import React from 'react'
import styled from 'styled-components/macro'


function Button({ onClick, children, disabled }) {
  return (
    <ButtonStyled
      onClick={onClick}
      disabled={disabled}
    >{children}</ButtonStyled>
  )
}

export const ButtonStyled = styled.button`
  padding: 10px;
  margin-bottom: 10px;
`

export default Button
