import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


function LinkUnstyled({ color='#000000', children, to, className }) {
  return (
    <LinkUnstyledStyled to={to} color={color} className={className}>{children}</LinkUnstyledStyled>
  )
}

const LinkUnstyledStyled = styled(Link)`
  color: ${props => props.color};
  text-decoration: none;
`

export default LinkUnstyled
