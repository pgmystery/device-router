import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

import MainTheme from '../../Theme'
import Wrapper from '../Wrapper'

import NavigationLink from './NavigationLink'
import ProfileWidget from './ProfileWidget'
import NotificationWidget from './NotificationWidget'


Navigation.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired
}

Navigation.defaultProps = {
  links: [
    {
      name: '(NO NAME)',
      link: '',
    }
  ]
}

function Navigation({ links, profileLinks, notifications, onNotificationClicked, onNotificationsDeleted }) {
  function getLinks() {
    return links.map((link, index) => 
      <NavigationLink
        to={link.url}
        key={index}
      >
        {link.name}
      </NavigationLink>
    )
  }

  return (
    <NavigationStyled>
      <Wrapper flex>
        <NavigationLeftStyled>
          {getLinks()}
        </NavigationLeftStyled>
        <NavigationRightStyled>
          <NotificationWidget notifications={notifications} onOpen={onNotificationClicked} onDelete={onNotificationsDeleted} />
          <ProfileWidget links={profileLinks} />
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
    margin: 0 20px
  }
  > *:first-child {
    margin-left: 0;
  }
  > *:last-child {
    margin-right: 0;
  }
`


export default Navigation
