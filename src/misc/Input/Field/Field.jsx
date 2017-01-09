import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

export const Component = React.createClass({
  render() {
    const { children, model, dispatch } = this.props;
    const additionalProps = {
      onChange: (event) => {
        const value = event.target.value;
        dispatch(actions.change(model, value))
      }
    }
    return React.cloneElement(children, additionalProps);
  }
});

export default connect()(Component);
