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
          if(info){
            return (
              <span key={labelId}
                className={classNames({[classes.tag] : tag}, {[classes.dot] : !tag})}
                style={{background: info.color}}
                title={!tag ? info.name : ''}>{tag ? <span>{info.name}</span> : null}</span>
            )
          }
          else{
            return null // The label does not exist
          }

        }) : null}
      </span>
    )
  }
});
