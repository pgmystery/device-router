import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

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


const mapStateToProps = ({ session: { id } }) => ({
  loggedIn: Boolean(id)
})

const protectedUrls = [
  {
    path: '/',
    exact: true,
    component: Dashboard
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/registerlist',
    exact: true,
    component: DeviceRegisterPage
  },
  {
    path: '/registerlist/new',
    exact: true,
    component: DeviceRegisterNew
  },
  {
    path: '/devices',
    exact: true,
    component: DevicesPage
  },
  {
    path: '/eshell',
    exact: true,
    component: EShellPage
  },
  {
    path: '/Profile',
    component: Profile
  },
  {
    path: '/logout',
    component: Logout,
  },
]

const notProtectedUrl = [
  {
    path: '/',
    exact: true,
    component: LoginPage,
  },
  {
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    path: '/register',
    exact: true,
    component: RegisterPage,
  },
]

function PageHandler({ loggedIn }) {

  function getRouteComponents(routes) {
    return (
      <>
        {routes.map(url => <Route key={url.path} {...url} />)}
        {
          !routes.map(url => url.path).includes(window.location.pathname)
            && <Redirect to="/" />
        }
      </>
    )
  }

  return (
    loggedIn
      ? <LoggedInPage>
          { getRouteComponents(protectedUrls) }
        </LoggedInPage>
      : getRouteComponents(notProtectedUrl)
  )
}


export default connect(mapStateToProps)(PageHandler)
