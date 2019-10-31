import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { logout } from '../../actions/session'
import { MainSocketContext } from '../../socketio/MainSocketContext'


const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

function Logout({ logout }) {
  const { mainSocket } = useContext(MainSocketContext)
  mainSocket.disconnect()

  logout()

  return <Redirect to='/' />
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
