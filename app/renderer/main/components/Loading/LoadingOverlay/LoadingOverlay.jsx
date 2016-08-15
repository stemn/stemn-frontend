import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Components
import LoadingSpinner from 'app/renderer/main/components/Loading/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './LoadingOverlay.css';

export default class extends Component {
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
                  <LoadingSpinner />
                </div>
            </div>
          </ReactCSSTransitionGroup>
        )

      }
    }
}
