import React from 'react'
import { Route } from 'react-router-dom'

import { AuthRoute, ProtectedRoute } from '../utils/routes'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'
import Profile from './pages/Profile'
import LoggedInPage from './pages/standard/LoggedInPage'
import DeviceRegisterPage from './pages/DeviceRegisterPage'
import DeviceRegisterNew from './pages/DeviceRegisterNew'
import DevicesPage from './pages/DevicesPage'
import EShellPage from './pages/EShellPage'

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
            exact
            path='/registerlist'
            component={DeviceRegisterPage}
          />
          <Route
            exact
            path='/registerlist/new'
            component={DeviceRegisterNew}
          />
          <Route
            exact
            path='/devices'
            component={DevicesPage}
          />
          <Route
            exact
            path='/eshell'
            component={EShellPage}
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
