import React from 'react'
import { Route, IndexRoute } from 'react-router'
import AppRootPage      from './pages/AppRootPage/AppRootPage.jsx'
import HomePage         from './pages/HomePage/HomePage.jsx'
import LoginPage        from './pages/LoginPage/LoginPage.jsx'
import ProjectPage      from './pages/ProjectPage/ProjectPage.jsx'
import AppAuthedPage    from './pages/AppAuthedPage/AppAuthedPage.jsx'
import AppUnAuthedPage  from './pages/AppUnAuthedPage/AppUnAuthedPage.jsx'

export default store => (
  <Route           component={ AppRootPage }     path="/">
    <Route         component={ AppAuthedPage }>
      <IndexRoute  component={ HomePage } />
      <Route       component={ ProjectPage }     path="/project/:stub" />
    </Route>
    <Route         component={ AppUnAuthedPage }>
      <Route       component={ LoginPage }       path="/login" />
    </Route>
  </Route>
)
