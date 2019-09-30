import React from 'react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import Button from './Button'


export default {
  title: 'Button',
  decorators: [withKnobs, withInfo]
}

export const standard = () =>
  <Button disabled={boolean('Disabled', false)}>{text('text', 'CLICK ME')}</Button>

standard.story = {
  name: 'Default'
}
