import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import PasswordInput from './PasswordInput'


export default {
  title: 'PasswordInput',
  decorators: [withKnobs, withInfo]
}

export const standard = () =>
  <PasswordInput onChange={() => {}} />

standard.story = {
  name: 'Default'
}
