import React from 'react';

export default (props) => {
  const rootStyles = {
    'height': '100vh',
    'width': '100vw',
  }
  return (
    <div className="layout-column" style={rootStyles}>
      {props.children}
    </div>
  )
}
