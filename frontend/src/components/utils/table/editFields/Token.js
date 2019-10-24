import React, { useState } from 'react'
import ReactSVG from 'react-svg'
import styled from 'styled-components/macro'

import { TextSpan, IconButton } from '../Table'
import refreshIcon from '../../../images/refresh_icon.svg'
import duplicateIcon from '../../../images/duplicate_icon.svg'


function Token({ text, onRefresh }) {
  const [expand, setExpand] = useState(false)

  return (
    <>
      <TextSpanStyled onClick={() => setExpand(true)} expand={expand}>{text}</TextSpanStyled>
      <IconButton onClick={onRefresh} popover={'Refresh Token'}>
        <ReactSVG src={refreshIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
      <IconButton onClick={() => {navigator.clipboard.writeText(text)}} popover={'Copy Token'}>
        <ReactSVG src={duplicateIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
    </>
  )
}

const TextSpanStyled = styled(TextSpan)`
  ${({expand}) => expand && "word-wrap: break-word; hyphens: auto;"}
`


export default Token
