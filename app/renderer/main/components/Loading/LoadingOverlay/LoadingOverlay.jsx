import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Components
//import { ProgressCircle } from 'react-desktop/windows';

// Styles
import styles from './LoadingOverlay.css';

export default class extends Component {
    static defaultProps = {
        color: '#2f2f2f'
    }
    render() {
      const width = 50;
      if(this.props.hide) {
        return null
      }
      else{
        return (
          <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            <div className={styles.loadingOverlay}>
                <div className={styles.loaderContainer}>
                  <div className={styles.loader}>
                    <svg className={styles.circular} viewBox={`${width/2} ${width/2} ${width} ${width}`}>
                      <circle className={styles.path} cx={width} cy={width} r={width/2 - 5} fill="none" stroke-width="2" stroke-miterlimit="10"/>
                    </svg>
                  </div>
                </div>
            </div>
          </ReactCSSTransitionGroup>
        )

      }
    }
}
