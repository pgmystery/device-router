import React from 'react'
import styled from 'styled-components/macro'

import MainTheme from '../Theme'
import Wrapper from './Wrapper'


function Navigation({ links }) {
  function getLinks() {
    return links.map((link, index) => <NavigationLinkStyled href={link.url} key={index}>{link.name}</NavigationLinkStyled>)
  }

  return (
    <NavigationStyled>
      <Wrapper flex>
        <NavigationLeftStyled>
          {getLinks()}
        </NavigationLeftStyled>
        <NavigationRightStyled>
          Hello World!
        </NavigationRightStyled>
      </Wrapper>
    </NavigationStyled>
  )
}

const NavigationStyled = styled.nav`
  background-color: ${MainTheme.mainColor};
  margin: 0 auto;
  height: 100%;
  display: flex;
`

const NavigationLinkStyled = styled.a`
  color: ${MainTheme.textColor};
  display: flex;
  align-items: center;
  text-decoration: none;
  letter-spacing: 0.8px;
  opacity: 0.8;

  :hover {
    text-decoration: underline;
    opacity: 1;
  }
`

const NavigationLeftStyled = styled.div`
  display: flex;
  
  > * {
    margin: 0 12px
  }
  > *:first-child {
    margin-left: 0;
  }
  > *:last-child {
    margin-right: 0;
  }
`
const NavigationRightStyled = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  
  > * {
    margin: 0 12px
  }
  > *:first-child {
    margin-left: 0;
  }
  > *:last-child {
    margin-right: 0;
  }
`


export default Navigation
