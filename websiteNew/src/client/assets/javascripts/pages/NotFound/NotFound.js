import React, { Component } from 'react';
import { Link } from 'react-router';
import StandardLayout from 'layout/StandardLayout'

import classes from './NotFound.css'

const NotFound = () => (
  <StandardLayout contained className={ classes.root + ' flex layout-column layout-align-center-center' }>
    <h1>LOST IN SPACE</h1>
    <p>It looks like the page you were looing for is gone</p>
  </StandardLayout>
);

export default NotFound;
