import React from 'react'
import { connect } from 'react-redux'
import { logout } from '../../actions/session'
import Wrapper from '../utils/Wrapper'

const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

function Dashboard({ logout, session }) {
  return (
    <Wrapper>
      <h1>Hi {session.username}</h1>
      <p>You are now logged in!</p>
      <button onClick={logout}>Logout</button>
    </Wrapper>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
