import React from 'react';

// Components
import Header from 'app/renderer/main/modules/Header/Header.jsx'

// Styles
import classNames from 'classnames';
//import classes from './HomePage.css'

export default class extends React.Component{
  render() {
    return (
      <div className="layout-column flex rel-box">
        <Header></Header>
        <div className="flex layout-column layout-align-center-center">
          <h1>________</h1>
        </div>
      </div>
    );
  }
};
