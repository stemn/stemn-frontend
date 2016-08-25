import React from 'react';

// Components
import Header from 'app/renderer/main/modules/Header/Header.jsx'
import {GoRepo} from 'react-icons/lib/go';

// Styles
import classNames from 'classnames';


export default class extends React.Component{
  render() {
    return (
      <div className="layout-column flex rel-box">
        <Header></Header>
        <div className="flex layout-column layout-align-center-center">
          <GoRepo size="100" />
          <div className="text-title-2" style={{marginTop: '20px'}}>No Project Selected</div>
        </div>
      </div>
    );
  }
};
