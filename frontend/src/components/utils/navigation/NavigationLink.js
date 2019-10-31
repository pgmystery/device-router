import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import MainTheme from '../../Theme'


NavigationLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

NavigationLink.defaultProps = {
  to: '',
  children: '(NO NAME)',
}

function NavigationLink({ to, children }) {
  return (
    to === undefined || (
      <NavigationLinkStyled to={to}>{children}</NavigationLinkStyled>
    )
  )
}

const NavigationLinkStyled = styled(Link)`
  color: ${MainTheme.textColor};
  display: flex;
  align-items: center;
  text-decoration: none;
  letter-spacing: 0.8px;
  opacity: 0.8;
  outline: none;
  user-select: none;

  :hover {
    text-decoration: underline;
    opacity: 1;
  }
`


export default NavigationLink
