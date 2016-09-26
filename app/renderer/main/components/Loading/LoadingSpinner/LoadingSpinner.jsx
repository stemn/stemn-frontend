import React, { Component } from 'react';

// Styles
import styles from './LoadingSpinner.css';

export default class extends Component {
    render() {
      const { size } = this.props;
      const width = 50;

      const tranformStyle = size == 'xs' ? {transform: 'scale(0.2)'} : {};
      return (
        <div className={styles.loader} style={tranformStyle}>
          <svg className={styles.circular} viewBox={`${width/2} ${width/2} ${width} ${width}`}>
            <circle className={styles.path} cx={width} cy={width} r={width/2 - 5} fill="none" strokeWidth="2" strokeMiterlimit="10"/>
          </svg>
        </div>
      )
    }
}
