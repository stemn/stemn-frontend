import React from 'react'
import cn from 'classnames'
import classes from './ThreadLabelDots.scss'
import Link from 'stemn-shared/misc/Router/Link'

export default class ThreadLabelDots extends React.Component {
  render() {
    // tag = true || false
    const { labels, labelInfo, tag, oneline, link, name, params, responsive } = this.props

    return (
      <span className={ cn({ [classes.tagsOneline]: oneline }) }>
        { labels && labelInfo
          ? labels.map((labelId) => {
            const info = labelInfo.find(label => label._id === labelId)
            if (info) {
              const tagStyle = {
                color: info.color,
                border: `1px solid ${info.color}`,
                backgroundColor: !tag ? info.color : 'transparent',
              }
              const tagBgStyle = {
                background: info.color,
              }
              const threadLabelClasses = cn({
                [classes.tag]: tag,
                [classes.dot]: !tag,
                [classes.responsive]: responsive,
              })

              if (link) {
                return (
                  <Link
                    key={ labelId }
                    className={ threadLabelClasses }
                    style={ tagStyle }
                    title={ !tag ? info.name : '' }
                    name={ name }
                    params={ params }
                    query={ { labels: [labelId] } }
                  >
                    { tag && info.name }
                    { tag && <span className={ classes.tagBg } style={ tagBgStyle } /> }
                  </Link>
                )
              } 
              return (
                <span
                  key={ labelId }
                  className={ threadLabelClasses }
                  style={ tagStyle }
                  title={ !tag ? info.name : '' }
                >
                  { tag && info.name }
                  { tag && <span className={ classes.tagBg } style={ tagBgStyle } /> }
                </span>
              )
            } 
            return null // The label does not exist
          }) : null}
      </span>
    )
  }
}
