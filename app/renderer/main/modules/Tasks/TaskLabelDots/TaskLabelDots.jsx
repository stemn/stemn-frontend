// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskLabelDots.css';


export default React.createClass({
  render() {
    // tag = true || false
    const { labels, labelInfo, tag } = this.props;

    return (
      <div className="layout-row layout-align-start-center">
        {labels && labelInfo ? labels.map(labelId => {
          const info = labelInfo.find(label => label._id == labelId);
          return (
            <div key={labelId}
            className={tag ? classes.tag : classes.dot}
            style={{background: info.color}}
            dataTitle={info.name}>{tag ? <span>{info.name}</span> : null}</div>
          )
        }) : null}
      </div>
    )
  }
});