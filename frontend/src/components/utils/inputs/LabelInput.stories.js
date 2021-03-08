import React, { useState } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info';
import LabelInput from './LabelInput'
import dateConverter, { dateConverterFromObject } from '../../../utils/dateConverter'


export default {
  title: 'LabelInput',
  decorators: [withKnobs, withInfo]
}

export const Standard = () => {
  const [value, setValue] = useState('Philipp Glaw')

  return <LabelInput type={'text'} value={value} onEdit={newValue => setValue(newValue)} />
}

export const Password = () => {
  const [value, setValue] = useState('Philipp Glaw')

  return <LabelInput type={'password'} value={value} onEdit={newValue => setValue(newValue)} />
}

export const _Date = () => {
  const [value, setValue] = useState(dateConverterFromObject(new Date()))

  return <LabelInput type={'date'} value={value} onEdit={newValue => setValue(dateConverter(newValue))} />
}

Standard.story = {
  name: 'Default'
}
