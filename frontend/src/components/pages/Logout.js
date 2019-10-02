import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { logout } from '../../actions/session'


const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

function Logout({ logout }) {
  logout()

  return <Redirect to='/' />
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)