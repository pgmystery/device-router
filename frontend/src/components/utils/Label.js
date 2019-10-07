import React from 'react'
import styled from 'styled-components'


function Label({ children, className }) {
  return(
    <LabelStyled className={className}>{children}</LabelStyled>
  )
}

const LabelStyled = styled.label`
  display: block;
  letter-spacing: 0.8px;
  margin-bottom: 5px;
`


export default Label
