import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import DropdownMenu, { DropdownMenuSeparator } from './DropdownMenu'


export default {
  title: 'DropdownMenu',
  decorators: [withKnobs, withInfo]
}

export const standard = () =>
  <DropdownMenu items={[
    <p>My Profile</p>,
    <p>My Dashboard</p>,
    <DropdownMenuSeparator />,
    <p style={{color: 'red'}}>Logout</p>,
  ]} />

standard.story = {
  name: 'Default'
}
