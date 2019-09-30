import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'

import LoggedInPage from '../components/pages/standard/LoggedInPage'

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

const Protected = ({ loggedIn, path, component: Component }) => (
  <LoggedInPage>
      <Route
      path={path}
      render={props => (
        loggedIn
          ? <Component {...props} />
          : <Redirect to='/login' />
      )}
    />
  </LoggedInPage>
)

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth)
)

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected)
)
