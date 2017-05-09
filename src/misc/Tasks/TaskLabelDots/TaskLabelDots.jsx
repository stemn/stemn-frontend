import React from 'react';
import classNames from 'classnames';
import classes from './TaskLabelDots.css';

export default React.createClass({
  render() {
    // tag = true || false
    const { labels, labelInfo, tag, oneline } = this.props

    return (
      <span className={ classNames({[classes.tagsOneline]: oneline }) }>
        { labels && labelInfo
          ? labels.map((labelId) => {
          const info = labelInfo.find(label => label._id == labelId)
          if (info) {
            const tagStyle = {
              color: info.color,
              border: `1px solid ${info.color}`,
            }
            const tagBgStyle = {
              background: info.color,
            }

            return (
              <span
                key={ labelId }
                className={ classNames({[classes.tag] : tag}, {[classes.dot] : !tag}) }
                style={ tagStyle }
                title={ !tag ? info.name : '' }
              >
                { tag && info.name }
                { tag && <span className={ classes.tagBg } style={ tagBgStyle }/> }
              </span>
            )
          } else{
            return null // The label does not exist
          }
        }) : null}
      </span>
    )
  }
});
