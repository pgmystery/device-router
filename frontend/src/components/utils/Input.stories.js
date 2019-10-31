import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import Input from './Input'


export default {
  title: 'Input',
  decorators: [withKnobs, withInfo]
}

export const standard = () =>
  <Input />

standard.story = {
  name: 'Default'
}
