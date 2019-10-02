import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import MainTheme from '../../Theme'


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

  :hover {
    text-decoration: underline;
    opacity: 1;
  }
`


export default NavigationLink
