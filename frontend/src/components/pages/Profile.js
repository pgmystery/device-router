import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import Wrapper from '../utils/Wrapper'
import Label from '../utils/Label'
import Input from '../utils/Input'
import InputText from '../utils/table/editFields/Input'
import ProfilePicture from '../utils/navigation/ProfilePicture'


const mapStateToProps = ({ session }) => ({
  session
})

function Profile({ session }) {
  const [username, setUsername] = useState(session.username)
  const [password, setPassword] = useState('')
  const [passwordComfirm, setPasswordComfirm] = useState('')
  const [picture, setPicture] = useState(session.picture)

  console.log(session)

  return (
    <Wrapper>
      <ProfileStyled>
          <ProfileInfosWrapper>
            <ProfilePictureStyled />
            <ProfileInfoUsernameWrapper>
              <Label>Username:</Label>
              <InputText type="text" name="username" placeholder="Username" text={username} icon={false} onChange={setUsername} />
            </ProfileInfoUsernameWrapper>
          </ProfileInfosWrapper>
          <div>
            <Label>Password:</Label>
            <Input type="password" name="password" placeholder="Password" value={password} onChange={setPassword} />
          </div>
          <div>
            <Label>Comfirm Password:</Label>
            <Input type="password" name="passwordComfirm" placeholder="Comfirm Password" value={passwordComfirm} onChange={setPasswordComfirm} />
          </div>
        
          <Link style={{color: 'red'}} to='/logout'>Logout</Link>
      </ProfileStyled>
    </Wrapper>
  )
}

const ProfileStyled = styled.div`
  margin: 20px 0;
  display: grid;
  grid-gap: 20px;
`

const ProfileInfosWrapper = styled.div`
  display: flex;
  align-items: center;
`

const ProfilePictureStyled = styled(ProfilePicture)`
  width: 64px;
  height: 64px;
  border: 1px solid #cacaca;
  margin-right: 20px;
`

const ProfileInfoUsernameWrapper = styled.div`
  width: 100%;
`


export default connect(
  mapStateToProps
)(Profile)
