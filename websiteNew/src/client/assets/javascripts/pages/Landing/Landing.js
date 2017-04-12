import React, { Component, PropTypes } from 'react';
import Header from '../../modules/Header'
import StandardLayout from 'layout/StandardLayout';


export default class Landing extends Component {
  render() {
    return (
      <StandardLayout contained style={ { marginTop: '30px' } }>
        Some Hompage/Dashboard here
      </StandardLayout>
    )
  }
}
