import React, { Component } from 'react';
import Popover   from '../../../assets/other/react-popup';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../components/Timeline/Timeline';
import SidebarTimeline  from '../../containers/SidebarTimeline';
import Changes  from '../../containers/ChangesPage';

const popupContent = (<Changes />);

const Main = React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle () {
    this.setState({ isOpen: !this.state.isOpen })
  },
  render () {
    const { isOpen, } = this.state
    return (
      <Popover isOpen={isOpen} body={popupContent} preferPlace = 'below'>
        <div
          className={ classNames('target', { isOpen }) }
          onClick={this.toggle}>
          here
        </div>
      </Popover>
    )
  },
})



// Styles
import classNames from 'classnames';

export default (props) => {
  const styles = {
      padding: '30px'
  }
  return (
    <div className="layout-column flex rel-box">
      <Timeline />
      <div className="layout-row flex">
        <div className="layout-column">
          <ContentSidebar className="flex">
            <SidebarTimeline />
          </ContentSidebar>
        </div>
        <div className="layout-column">
          <Main></Main>
        </div>
      </div>
    </div>
  );
}
