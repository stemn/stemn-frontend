import React from 'react';

import Tabs from 'app/renderer/main/components/Tabs/Tabs'

// Styles
import classNames from 'classnames';

const PageStyles = {
  padding: '40px'
}

export default (props) => {
  return (
    <div className="layout-column flex rel-box" style={PageStyles}>
      <Tabs>
        <a className="active">Changes</a>
        <a href="">Feed</a>
        <a href="">Threads</a>
      </Tabs>
    </div>
  );
}
