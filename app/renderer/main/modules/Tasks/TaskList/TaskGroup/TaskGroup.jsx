import React from 'react';

export default class Component extends React.Component {
  render() {
    const { item, children, layout } = this.props;

    const styles = layout == 'list' ? {
      marginBottom: '20px'
    } : {
      padding: '0 15px',
      width: '350px'
    }
    return (
      <div style={styles}>
        <h3 className="text-mini-caps">{item.name}</h3>
        {children}
      </div>
    );
  }
}
