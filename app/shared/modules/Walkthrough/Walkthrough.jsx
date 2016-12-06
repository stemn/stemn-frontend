// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as WalkthroughActions from './Walkthrough.actions.js';

// Component Core
import React, { PropTypes } from 'react';
import { omit } from 'lodash';
import walkthroughConfig from './Walkthrough.config.js';

// Styles
import classNames from 'classnames';
import classes from './Walkthrough.css';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';

const WalkthroughPropTypes = {
  children  : PropTypes.node,      // Child element
  name      : PropTypes.string,    //
}
///////////////////////////////// COMPONENT /////////////////////////////////

export const Walkthrough = React.createClass({
  propTypes: WalkthroughPropTypes,
  render() {
    const { children, name, walkthrough } = this.props;
    const isActive = walkthrough.active.includes(name);
    const data = walkthroughConfig(name);
    return (
      <PopoverMenu { ...omit(this.props, Object.keys(WalkthroughPropTypes))}
        open={isActive}
        trigger="none"
        tipSize={6}
        >
        {children || <div></div>}
        <div className={classes.walkthrough}>
          {data.content}
        </div>
      </PopoverMenu>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({walkthrough}) {
  return { walkthrough };
}

function mapDispatchToProps(dispatch) {
  return {
    walkthroughActions: bindActionCreators(WalkthroughActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);
