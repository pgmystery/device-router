import React from 'react'
import styled from 'styled-components/macro'

import Navigation from '../../utils/Navigation'


function LoggedInPage({ children }) {
  const navLinks = [
    {
      name: 'Dashboard',
      url: '/dashboard',
    },
    {
      name: 'Registerlist',
      url: '/registerlist',
    },
    {
      name: 'Devices',
      url: '/devices',
    },
    {
      name: 'EShell',
      url: '/eshell',
    },
  ]

  return (
    <>
      <HeaderStyled>
        <Navigation links={navLinks}></Navigation>
      </HeaderStyled>
      <main>{children}</main>
      <footer></footer>
    </>
  )
}

const HeaderStyled = styled.header`
  height: 64px;
`


export default LoggedInPage
