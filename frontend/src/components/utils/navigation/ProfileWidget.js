import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import ProfilePicture from './ProfilePicture'
import NavigationLinkStyled from './NavigationLink'
import ArrowDown from '../../images/arrowDown.svg'
import DropdownMenu from '../DropdownMenu'


const mapStateToProps = ({ session }) => ({
  session
})

function ProfileWidget({ links, session }) {
  const [openMenu, setOpenMenu] = useState(false)

  function clickHandler(event) {
    event.stopPropagation()
    setOpenMenu(!openMenu)
  }

  return (
    <ProfileWidgetStyled onClick={clickHandler}>
      <NavigationLinkStyled>{session.username}</NavigationLinkStyled>
      <ProfilePicture />
      <ReactSVG
        src={ArrowDown}
        beforeInjection={svg => {
          svg.setAttribute('style', 'width: 10px; height: 10px; fill: #ffffff;')
        }}
    />
    { openMenu && <DropdownMenu items={links} /> }
    </ProfileWidgetStyled>
  )
}

const ProfileWidgetStyled = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  :hover {
    cursor: pointer;

    > a {
      text-decoration: underline;
      opacity: 1;
    }
  }

  > :nth-child(2) {
    margin: 0 12px;
  }
`


export default connect(
  mapStateToProps
)(ProfileWidget)
