import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const propTypesObject = {
  ownerId  : PropTypes.string,
  userId   : PropTypes.string.isRequired,
  children : PropTypes.node.isRequired,
};

export const IsOwner = React.createClass({
  propTypes: propTypesObject,
  render() {
    const { userId, ownerId, children } = this.props
    return ownerId == userId ? children : null
  }
});

function mapStateToProps({auth}) {
  return {
    userId: auth.user._id,
  };
}
export default connect(mapStateToProps)(IsOwner);
