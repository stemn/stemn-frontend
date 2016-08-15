import React, { Component } from 'react';

// Styles
import styles from './LoadingSpinner.css';

export default class extends Component {
    render() {
      const width = 50;
      return (
        <div className={styles.loader}>
          <svg className={styles.circular} viewBox={`${width/2} ${width/2} ${width} ${width}`}>
            <circle className={styles.path} cx={width} cy={width} r={width/2 - 5} fill="none" stroke-width="2" stroke-miterlimit="10"/>
          </svg>
        </div>
      )
    }
}
