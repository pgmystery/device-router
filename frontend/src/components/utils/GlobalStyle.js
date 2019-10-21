import { createGlobalStyle } from 'styled-components/macro'


const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Open Sans,sans-serif;
  }

  #root {
    height: 100vh;
    display: grid;
    grid-template-rows: 64px auto
  }
`

export default GlobalStyle
