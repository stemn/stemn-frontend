import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import cn from 'classnames'
import classes from './SocialButton.css'
import MdStar from 'react-icons/md/star'
import MdStarBorder from 'react-icons/md/star-border'
import MdBookmark from 'react-icons/md/bookmark'
import MdBookmarkBorder from 'react-icons/md/bookmark-outline'
import MdContentCopy from 'react-icons/md/content-copy'

const getIcon = (type, entityType, status) => {
  if (type === 'like') {
    return status
      ? <MdStar />
      : <MdStarBorder />
  } else if (type === 'follow') {
    return status
      ? <MdBookmark />
      : <MdBookmarkBorder />
  } else if (type === 'clone') {
    return status
      ? <MdContentCopy />
      : <MdContentCopy />
  }
}

const getText = (type, entityType, status) => {
  if (type === 'like') {
    return status
      ? 'Starred'
      : 'Star'
  } else if (type === 'follow' && entityType === 'thread') {
    return status
      ? 'Subscribed'
      : 'Subscribe'
  } else if (type === 'follow') {
    return status
      ? 'Following'
      : 'Follow'
  } else if (type === 'clone') {
    return status
      ? 'Cloned'
      : 'Clone'
  }
}

const getTooltip = (type, entityType, status) => {
  if (type === 'like') {
    
  } else if (type === 'follow' && entityType === 'thread') {
    return 'Subscribe to notifications'
  } else if (type === 'follow') {
    return ''
  } else if (type === 'clone') {
    return 'Copies this project into your dropbox/drive'
  }
}

export default class SocialButton extends Component {
  static propTypes = {
    checkStatus: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    entityId: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
    number: PropTypes.number,               // Count - i.e. numLikes or numFollows
    numberModel: PropTypes.string,          // The model of the count - used to iterate it
    type: PropTypes.oneOf(['follow', 'like', 'clone']).isRequired,
    status: PropTypes.bool.isRequired,
  }

  componentWillMount = () => {
    const { checkStatus, entityId, entityType, type } = this.props
    checkStatus({
      entityId,
      entityType,
      type,
    })
  }

  toggle = () => {
    const { status: { status, parentId: projectCloneId }, type, remove, add, number, numberModel, entityId, entityType } = this.props
    if (status) {
      remove({
        entityId,
        entityType,
        type,
        number,
        numberModel,
        projectCloneId,
      })
    } else {
      add({
        entityId,
        entityType,
        type,
        number,
        numberModel,
      })
    }
  }

  render() {
    const {
      add,
      checkStatus,
      className,
      entityId,
      entityType,
      number,
      numberModel,
      remove,
      status: { status },
      type,
      ...otherProps
    } = this.props
    
    return (
      <div className={ cn(classes.button, className) } { ...otherProps }>
        <div className={ cn(classes.main) } onClick={ this.toggle } title={ getTooltip(type, entityType, status) }>
          { getIcon(type, entityType, status) }
          { getText(type, entityType, status) }
        </div>
        { !(number === undefined) && numberModel
          ? <div className={ classes.count }>
            { number }
          </div>
          : null }
      </div>
    )
  }
}
