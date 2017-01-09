import React, {PropTypes} from 'react';

export default React.createClass({
  render() {
    const { fileMeta } = this.props;
    return (
      <div className="flex rel-box layout-column">
        <iframe className="flex" src={fileMeta.url} style={{border: 'none'}}></iframe>
      </div>
    )
  }
});
