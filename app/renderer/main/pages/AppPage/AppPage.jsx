// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/renderer/main/modules/Changes/Changes.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    return (
      <div></div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ system, settings, header }) {
  return { system, settings, header };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ChangesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
