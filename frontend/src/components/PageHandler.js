import React from 'react'

import { AuthRoute, ProtectedRoute } from '../utils/routes'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'

function PageHandler() {

  return (
    <>
      <ProtectedRoute exact path='/' component={Dashboard} />
      <AuthRoute path='/login' component={LoginPage} />
      <AuthRoute path='/register' component={RegisterPage} />
    </>
  )
}


export default PageHandler
