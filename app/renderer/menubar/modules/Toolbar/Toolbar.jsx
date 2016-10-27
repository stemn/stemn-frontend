// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as MenubarLayoutActions from 'app/shared/actions/menubarLayout';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import toolbarStyles from './Toolbar.css'

// Sub Components
import MdMenu from 'react-icons/md/menu';


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { menu, menubarLayoutActions, children } = this.props;
    const textStyle = menu ? {marginLeft: '10px'} : {};
    return (
      <div className={classNames(toolbarStyles.toolbar, 'layout-row layout-align-start-center')}>
        {menu ? <MdMenu size="22" onClick={()=>menubarLayoutActions.toggleSidebar(true)}/> : ''}
        <div className="flex layout-row layout-align-start-center" style={textStyle}>
          {children}
        </div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    menubarLayoutActions: bindActionCreators(MenubarLayoutActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
