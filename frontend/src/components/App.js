import React from 'react'
// import styled from 'styled-components/macro'
import GlobalStyle from './utils/GlobalStyle'
import PageHandler from './PageHandler'

import '../../node_modules/xterm/dist/xterm.css'


// https://www.npmjs.com/package/mxgraph
// devicerouter.de/.com


export const backendUrl = ''

function App() {
  return (
    <>
      <GlobalStyle />
      <PageHandler />
    </>
  )
}


export default App
