import React from 'react'
import styled from 'styled-components'
import { withKnobs, array } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info'

import NotificationWidget from './NotificationWidget'


export default {
  title: 'NotificationWidget',
  decorators: [withKnobs, withInfo, Wrapper]
}


function Wrapper(storyFn) {
  return <WrapperStyled>{storyFn()}</WrapperStyled>
}

export const standard = () => (
    <NotificationWidget notifications={array('notifications', [])} onOpen={()=>{}} onDelete={()=>{}} />
  )

const WrapperStyled = styled.div`
  background-color: rgb(0, 100, 159);
  display: flex;
  justify-content: end;
  padding: 10px 20px;
`


standard.story = {
  name: 'Default'
}
