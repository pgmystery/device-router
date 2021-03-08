import React from 'react'

import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info'
import Table from './Table'


export default {
  title: 'Table',
  decorators: [withKnobs, withInfo]
}

export const standard = () => {
  const headerItems = {
    firstname: 'Firstname',
    secondname: 'Secondname',
    email: 'E-Mail',
    type: 'Type',
  }

  const items = [
    {
      firstname: 'Hans',
      secondname: 'Wuff',
      email: 'hans.wuff@maulkorp.de',
      type: 'Hund',
    },
    {
      firstname: 'Bärbel',
      secondname: 'Miau',
      email: 'mieze123@mause-jaeger.de',
      type: 'Katze',
    }
  ]

  return <Table 
      headerItems={headerItems}
      items={items}
      noItemsText={''}
    />
}


standard.story = {
  name: 'Default'
}
