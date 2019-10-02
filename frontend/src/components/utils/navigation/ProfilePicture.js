import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'


const mapStateToProps = ({ session }) => ({
  session
})

function ProfilePicture({ session }) {
  return <ProfilePictureStyled src={'data:image/png;base64,' + session.picture} />
}

const ProfilePictureStyled = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%
`


export default connect(
  mapStateToProps
)(ProfilePicture)
