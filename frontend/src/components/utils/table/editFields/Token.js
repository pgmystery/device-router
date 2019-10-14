import React from 'react'
import ReactSVG from 'react-svg'

import { TextSpan, IconButton } from '../Table'
import refreshIcon from '../../../images/refresh_icon.svg'
import duplicateIcon from '../../../images/duplicate_icon.svg'


function Token({ text, onRefresh }) {
  return (
    <>
      <TextSpan>{text}</TextSpan>
      <IconButton onClick={onRefresh}>
        <ReactSVG src={refreshIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
      <IconButton onClick={() => {navigator.clipboard.writeText(text)}}>
        <ReactSVG src={duplicateIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 16px; height: 16px; display: flex;')
        }} />
      </IconButton>
    </>
  )
}


export default Token
