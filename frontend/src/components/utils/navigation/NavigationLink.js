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

function NavigationLink({ to, children, onClick, active=false }) {
  return (
    to === undefined || (
      <NavigationLinkStyled to={to} onClick={onClick} active={active ? 1 : 0}>{children}</NavigationLinkStyled>
    )
  )
}

const NavigationLinkStyled = styled(Link)`
  color: ${MainTheme.textColor};
  display: flex;
  align-items: center;
  text-decoration: ${props => props.active ? "underline" : "none"};
  letter-spacing: 0.8px;
  opacity: ${props => props.active ? 1.0 : 0.8};
  outline: none;
  user-select: none;

  :hover {
    opacity: 1;
  }
`


export default NavigationLink
