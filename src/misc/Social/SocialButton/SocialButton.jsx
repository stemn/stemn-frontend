import React, { Component, PropTypes } from 'react'

import classNames from 'classnames'
import classes from './SocialButton.css'
import MdStar from 'react-icons/md/star'
import MdStarBorder from 'react-icons/md/star-border'
import MdBookmark from 'react-icons/md/bookmark'
import MdBookmarkBorder from 'react-icons/md/bookmark-outline'

const getIcon = (type, status) => {
  if (type === 'like') {
    return status
      ? <MdStar />
      : <MdStarBorder />
  } else if (type === 'follow') {
    return status
      ? <MdBookmark />
      : <MdBookmarkBorder />
  }
}

const getText = (type, status) => {
  if (type === 'like') {
    return status
      ? 'Starred'
      : 'Star'
  } else if (type === 'follow') {
    return status
      ? 'Following'
      : 'Follow'
  }
}

export default class SocialButton extends Component {
  static propTypes = {
    checkStatus: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    entityId: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    numberModel: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['follow', 'like']).isRequired,
    status: PropTypes.bool.isRequired,
  }

  componentWillMount = () => {
    const { checkStatus, entityId, type } = this.props
    checkStatus(entityId, type);
  }

  toggle = () => {
    const { status, type, remove, add, number, numberModel, entityId } = this.props
    if (status) {
      remove({ entityId, type, number, numberModel })
    } else {
      add({ entityId, type, number, numberModel })
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
      status,
      type,
      ...otherProps,
    } = this.props
    return (
      <div className={ classNames(classes.button, className) } { ...otherProps }>
        <div className={ classNames(classes.main) } onClick={ this.toggle }>
          { getIcon(type, status) }
          { getText(type, status) }
        </div>
        <div className={ classes.count }>
          { number }
        </div>
      </div>
    )
  }
}
