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
      <span>
        {labels && labelInfo ? labels.map(labelId => {
          const info = labelInfo.find(label => label._id == labelId);
          return (
            <span key={labelId}
            className={classNames({[classes.tag] : tag}, {[classes.dot] : !tag}, {'tooltip' : !tag})}
            style={{background: info.color}}
            alt={info.name}>{tag ? <span>{info.name}</span> : null}</span>
          )
        }) : null}
      </span>
    )
  }
});
