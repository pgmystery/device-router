import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/macro'

import request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import Label from '../utils/Label'
import LabelInput from '../utils/inputs/LabelInput'
import ProfilePicture from '../utils/navigation/ProfilePicture'
import { updateSession } from '../../actions/session'


const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  updateSession: user => dispatch(updateSession(user))
})

function Profile({ session, updateSession }) {
  const [username, setUsername] = useState(session.username)
  const [firstname, setFirstname] = useState(session.firstname)
  const [secondname, setSecondname] = useState(session.secondname)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [email, setEmail] = useState(session.email)

  function changeProfile([state, setState], type, newValue) {
    if (newValue.length > 0 && newValue !== state) {
      return request.patch({ url: '/api/users', data: {[type]: newValue}})
        .then(newProfileData => {
          if (setState) {
            setState(newProfileData[type])
            updateSession(newProfileData)
          }
          return true
        })
        .catch(() => false)
    }
  }

  function newPasswordChanged(password) {
    if (newPassword !== password ) {
      setNewPassword(password)

      if (password.length > 0 && password === newPasswordConfirm) {
        return changeProfile([newPassword, null], 'password', password)
          .then(() => {
            setNewPassword('')
            setNewPasswordConfirm('')
            return true
          })
          .catch(() => false)
      }
    }
  }

  function newPasswordConfirmChanged(password) {
    if (newPasswordConfirm !== password ) {
      setNewPasswordConfirm(password)

      if (password.length > 0 && password === newPassword) {
        return changeProfile([newPasswordConfirm, null], 'password', password)
          .then(() => {
            setNewPassword('')
            setNewPasswordConfirm('')
            return true
          })
          .catch(() => false)
      }
    }
  }

  return (
    <Wrapper>
      <ProfileStyled>
          <InfoWrapper>
            <ProfilePictureStyled />
            <MaxWidthWrapper>
              <Label>Username:</Label>
              <LabelInputStyled
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onEdit={newName => changeProfile([username, setUsername], 'username', newName)}
                required
              />
            </MaxWidthWrapper>
          </InfoWrapper>
          <TwoFieldWrapper>
            <HalfWidthWrapper>
              <Label>Firstname:</Label>
              <LabelInputStyled
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={firstname}
                onEdit={newName => changeProfile([firstname, setFirstname], 'firstname', newName)}
                required
              />
            </HalfWidthWrapper>
            <HalfWidthWrapper>
              <Label>Secondname:</Label>
              <LabelInputStyled
                type="text"
                name="Secondname"
                placeholder="Secondname"
                value={secondname}
                onEdit={newName => changeProfile([secondname, setSecondname], 'secondname', newName)}
                required
              />
            </HalfWidthWrapper>
          </TwoFieldWrapper>
          <TwoFieldWrapper>
            <HalfWidthWrapper>
              <Label>New Password:</Label>
              <LabelInputStyled
                type="password"
                name="password"
                placeholder="Password" 
                value={newPassword} 
                onEdit={newPasswordChanged} 
              />
            </HalfWidthWrapper>
            <HalfWidthWrapper>
              <Label>Confirm new Password:</Label>
              <LabelInputStyled
                type="password"
                name="passwordConfirm"
                placeholder="Confirm new Password"
                value={newPasswordConfirm}
                onEdit={newPasswordConfirmChanged}
              />
            </HalfWidthWrapper>
          </TwoFieldWrapper>
          <TwoFieldWrapper>
            <HalfWidthWrapper>
              <Label>E-Mail:</Label>
              <LabelInputStyled
                type="email"
                name="email"
                placeholder="E-Mail"
                value={email}
                onEdit={newEMail => changeProfile([email, setEmail], 'email', newEMail)}
                required
              />
            </HalfWidthWrapper>
          </TwoFieldWrapper>
      </ProfileStyled>
    </Wrapper>
  )
}

const ProfileStyled = styled.div`
  margin: 20px 0;
  display: grid;
  grid-gap: 40px;
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: start;
`

const ProfilePictureStyled = styled(ProfilePicture)`
  width: 64px;
  height: 64px;
  border: 1px solid #cacaca;
  margin-right: 20px;
`

const MaxWidthWrapper = styled.div`
  width: 100%;
`

const HalfWidthWrapper = styled.div`
  width: 50%;
`

const LabelInputStyled = styled(LabelInput)`
  width: 100%;
`

const TwoFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
