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
      if(this.props.hide) {
        return null
      }
      else{
        return (
          <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            <div className={styles.loadingOverlay}>
                <div className={styles.loader}>
                </div>
            </div>
          </ReactCSSTransitionGroup>
        )

      }
    }
}

//                    <ProgressCircle color={this.props.color} size={100} />
