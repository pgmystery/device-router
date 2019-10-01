import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'


const mapStateToProps = ({ session: { id } }) => ({
  loggedIn: Boolean(id)
})

const Auth = ({ loggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={props => (
      loggedIn
        ? <Redirect to='/dashboard' />
        : <Component {...props} />
    )}
  />
)

const Protected = ({ loggedIn, path, children }) => (
  <Route
    path={path}
    render={props => (
      loggedIn
        ? children
        : <Redirect to='/login' />
    )}
  />
)

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth)
)

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected)
)
