import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import styled from 'styled-components'

import GlobalStyle from '../src/components/utils/GlobalStyle'


const Container = styled.div`
  padding: 20px;
`

const GlobalStyleDecorator = storyFn => (
  <Container>
    <GlobalStyle />
    { storyFn() }
  </Container>
)
addDecorator(GlobalStyleDecorator)

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
