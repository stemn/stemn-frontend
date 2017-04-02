import React, { Component } from 'react';
import { Link } from 'react-router';
import StandardLayout from 'layout/StandardLayout'
const NotFound = () => (
  <StandardLayout contained>
    <h1>404</h1>
    <p>This page could not be found</p>
    <Link to="/">Back To Home</Link>
  </StandardLayout>
);

export default NotFound;
