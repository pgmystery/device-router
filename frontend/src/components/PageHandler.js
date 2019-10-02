import React from 'react'
import { Route } from 'react-router-dom'

import { AuthRoute, ProtectedRoute } from '../utils/routes'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'
import Profile from './pages/Profile'
import LoggedInPage from './pages/standard/LoggedInPage'
import DeviceRegisterList from './pages/DeviceRegisterList'

function PageHandler() {

  return (
    <>
      <ProtectedRoute path='/' >
        <LoggedInPage>
          <Route
            path='/'
            exact
            component={Dashboard}
          />
          <Route
            path='/dashboard'
            component={Dashboard}
          />
          <Route
            path='/registerlist'
            component={DeviceRegisterList}
          />
          <Route
            path='/Profile'
            component={Profile}
          />
          <Route
            path='/logout'
            component={Logout}
          />
        </LoggedInPage>
      </ProtectedRoute>

      <AuthRoute path='/login' component={LoginPage} />
      <AuthRoute path='/register' component={RegisterPage} />
    </>
  )
}


export default PageHandler
