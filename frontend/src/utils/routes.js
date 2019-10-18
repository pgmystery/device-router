import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'


const mapStateToProps = ({ session: { id } }) => ({
  loggedIn: Boolean(id)
})

const Auth = ({ loggedIn, path, children }) => (
  loggedIn
    ? <Redirect to="/dashboard" />
    : <Route
        path={path}
        render={props => children}
      />
)

const Protected = ({ loggedIn, path, children }) => (
  loggedIn
    ? <Route
        path={path}
        render={props => children}
      />
    : <Redirect to="/login" />
)

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth)
)

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected)
)
