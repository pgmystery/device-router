import React, { useState } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import LabelInput from './LabelInput'
import dateConverter, { dateConverterFromObject } from '../../../utils/dateConverter'


export default {
  title: 'LabelInput',
  decorators: [withKnobs, withInfo]
}

export const standard = () => {
  const [value, setValue] = useState('Philipp Glaw')

  return <LabelInput type={'text'} value={value} onEdit={newValue => setValue(newValue)} />
}

export const password = () => {
  const [value, setValue] = useState('Philipp Glaw')

  return <LabelInput type={'password'} value={value} onEdit={newValue => setValue(newValue)} />
}

export const date = () => {
  const [value, setValue] = useState(dateConverterFromObject(new Date()))

  return <LabelInput type={'date'} value={value} onEdit={newValue => setValue(dateConverter(newValue))} />
}

standard.story = {
  name: 'Default'
}
