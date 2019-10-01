import React from 'react'
import styled from 'styled-components/macro'

import MainTheme from '../Theme'


function Wrapper({ children, flex }) {
  const style = {
    display: flex ? 'flex' : 'block'
  }

  return (
    <WrapperStyled style={style}>{children}</WrapperStyled>
  )
}

const WrapperStyled = styled.div`
  max-width: ${MainTheme.wrapperMaxWidth};
  padding-left: ${MainTheme.wrapperPadding};
  padding-right: ${MainTheme.wrapperPadding};
  margin: 0 auto;
  width: 100%;
`


export default Wrapper
