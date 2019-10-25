import React from 'react'
import styled from 'styled-components'

import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import { Button, ButtonPrimary, ButtonDanger, ButtonSuccess } from './Button'


export default {
  title: 'Buttons',
  decorators: [withKnobs, withInfo, Wrapper]
}

export const standard = () =>
  <Button disabled={boolean('Disabled', false)} tooltip={text('tooltip', 'Tooltip')}>{text('text', 'CLICK ME')}</Button>

export const primary = () =>
<ButtonPrimary disabled={boolean('Disabled', false)} tooltip={text('tooltip', 'Tooltip')}>{text('text', 'CLICK ME')}</ButtonPrimary>

export const danger = () =>
  <ButtonDanger disabled={boolean('Disabled', false)} tooltip={text('tooltip', 'Tooltip')}>{text('text', 'CLICK ME')}</ButtonDanger>

export const success = () =>
<ButtonSuccess disabled={boolean('Disabled', false)} tooltip={text('tooltip', 'Tooltip')}>{text('text', 'CLICK ME')}</ButtonSuccess>

const Wrapper = styled.div`
  padding: 50px;
`


standard.story = {
  name: 'Default'
}
