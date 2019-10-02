import React from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import Popover from './Popover'


export default {
  title: 'Popover',
  decorators: [withKnobs, withInfo]
}

export const standard = () => 
  <Popover header={text('header', 'HEADER')} body={text('body', 'BODY')} />

standard.story = {
  name: 'Default'
}
