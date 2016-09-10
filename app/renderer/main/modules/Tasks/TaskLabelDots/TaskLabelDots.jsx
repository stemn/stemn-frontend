// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskLabelDots.css';


export default React.createClass({
  render() {
    const { labels, labelInfo } = this.props;

    return (
      <div>
        {labels && labelInfo ? labels.map(labelId => {
          const info = labelInfo.find(label => label._id == labelId);
          return (
            <div key={labelId}
            className={classes.dot}
            style={{background: info.color}}
            dataTitle={info.name}></div>
          )
        }) : null}
      </div>
    )
  }
});
