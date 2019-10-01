import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Wrapper from '../utils/Wrapper'


const mapStateToProps = ({ session }) => ({
  session
})

function Profile({ session }) {
  return (
    <Wrapper>
      <h1>Hi {session.username}</h1>
      <p>This is you Profile!</p>
      <Link to='/logout'>Logout</Link>
    </Wrapper>
  )
}

export default connect(
  mapStateToProps
)(Profile)
