import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Wrapper from '../utils/Wrapper'


const mapStateToProps = ({ session }) => ({
  session
})

function Dashboard({ session }) {
  return (
    <Wrapper>
      <h1>Hi {session.username}</h1>
      <p>You are now logged in!</p>
      <Link to='/logout'>Logout</Link>
    </Wrapper>
  )
}

export default connect(
  mapStateToProps
)(Dashboard)
