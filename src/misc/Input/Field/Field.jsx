import React from 'react';
import { connect } from 'react-redux';
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

export const Component = React.createClass({
  render() {
    const { children, model, dispatch } = this.props;
    const additionalProps = {
      onChange: (event) => {
        const value = event.target.value;
        dispatch(storeChange(model, value))
      }
    }
    return React.cloneElement(children, additionalProps);
  }
});

export default connect()(Component);
