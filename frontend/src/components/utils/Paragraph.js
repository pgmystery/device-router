import React from 'react'
import styled from 'styled-components'


function P(props) {
  const { children, className } = props

  return(
    <PStyled className={className} {...props}>{children}</PStyled>
  )
}

const PStyled = styled.p`
  display: block;
  letter-spacing: 0.8px;
  margin: 0 0 5px 0;
`


export default P
