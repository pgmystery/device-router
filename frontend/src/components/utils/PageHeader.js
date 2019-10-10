import React from 'react'
import styled from 'styled-components'


function PageHeader({ leftComponent, rightComponent }) {
  return (
    <PageHeaderStyled>
      <PageHeaderLeft>
        {leftComponent}
      </PageHeaderLeft>
      <PageHeaderRight>
        {rightComponent}
      </PageHeaderRight>
    </PageHeaderStyled>
  )
}

const PageHeaderStyled = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  height: 76px;
`

const PageHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const PageHeaderRight = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`


export default PageHeader
