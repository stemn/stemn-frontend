import React from 'react';
import classNames from 'classnames';
import moment from 'moment';


// Styles
import styles from './SidebarTimelineRow.css';

export default (props) => {
  const rowClasses = classNames({
    [styles.timelineRow]: true,
    [styles.active]: props.isActive,
    'layout-row' : true,
    'layout-align-start-center' : true
  });

  const timeFromNow = moment(props.item.timestamp).fromNow();
  return (
    <div className={rowClasses}>
      <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={props.clickFn}>
        <img src={'https://stemn.com' + props.item.actor.picture + '?size=thumb&crop=true'} />
        <div className={styles.text + ' flex'}>
          <b>{props.item.data.summary}</b>
          <div>{timeFromNow} by {props.item.actor.name}</div>
        </div>
      </div>
      <div className={styles.button}>
        3
      </div>
    </div>
  )
}
