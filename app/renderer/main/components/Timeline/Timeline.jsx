import React from 'react';

// Styles
import styles from './Timeline.css';

export default class Timeline extends React.Component {
  render() {
    const leftStyle = ['0%', '25%', '50%', '100%'].map((item)=>{return {left: item}});
    return (
      <div className={styles.timeline +' layout-row'}>
        <div className={styles.line}>
          <div className={styles.dot} style={leftStyle[0]}></div>
          <div className={styles.dot} style={leftStyle[1]}></div>
          <div className={styles.dot} style={leftStyle[2]}></div>
          <div className={styles.dot} style={leftStyle[3]}></div>
        </div>
      </div>
    );
  }
}
