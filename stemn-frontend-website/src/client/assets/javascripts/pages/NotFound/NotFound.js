import React from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Helmet } from 'react-helmet'
import classes from './NotFound.css'

const NotFound = () => (
  <StandardLayout contained className={ `${classes.root} flex layout-column layout-align-center-center` }>
    <Helmet>
      <title>404: Page Not Found</title>
    </Helmet>
    <h1>LOST IN SPACE</h1>
    <p>It looks like the page you were looing for is gone</p>
  </StandardLayout>
)

export default NotFound
