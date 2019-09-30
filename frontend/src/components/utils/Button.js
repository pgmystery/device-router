import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
}

Button.defaultProps = {
  children: '(NO TITLE)',
  disabled: false,
}

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
