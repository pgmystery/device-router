import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

import MainTheme from '../Theme'

ButtonComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
}

ButtonComponent.defaultProps = {
  children: '(NO TITLE)',
  disabled: false,
}

function ButtonComponent({ onClick, children, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >{children}</button>
  )
}

export const Button = styled(ButtonComponent)`
  border-color: transparent;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: solid;
  text-align: center;
  font-weight: 700;
  transition: background-color .4s cubic-bezier(.25,.8,.25,1),border-color .6s cubic-bezier(.25,.8,.25,1);
  padding: 0 10px;
  margin: 6px 8px;
  line-height: 32px;
  min-height: 32px;
  border-width: 2px;
  border-radius: 2px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f0f0f0;
  border-color: #f0f0f0;

  :hover {
    background-color: #e2e6ea;
    border-color: #e2e6ea;
  }

  :active {
    background-color: #cbd0d5;
  }

  ${
    props =>
      props.disabled &&
        `background-color: #827d7d !important;
        border-color: #c7c6cc !important;
        cursor: not-allowed !important;`
  }
`

export const ButtonPrimary = styled(Button)`
  background-color: #2596ec;
  border-color: #2596ec;
  color: #ffffff;

  :hover {
    background-color: #287cf9;
    border-color: #287cf9;
  }

  :active {
    background-color: ${MainTheme.mainColor};
  }
`

export const ButtonSuccess = styled(Button)`
  background-color: #28a745;
  border-color: #28a745;
  color: #ffffff;

  :hover {
    background-color: #279f42;
    border-color: #279f42;
  }

  :active {
    background-color: #218838;
  }
`

export const ButtonDanger = styled(Button)`
  background-color: #ef4a53;
  border-color: #ef4a53;
  color: #ffffff;

  :hover {
    background-color: #e3444d;
    border-color: #e3444d;
  }

  :active {
    background-color: #bf3b42;
  }
`


export default Button
