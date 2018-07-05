import React, { Component } from 'react'

import classes from './CommentBody.scss'

import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'

export default class Comment extends Component {
  render() {
    const { comment, style } = this.props

    if (!comment || !comment.data) {
      return (
        <LoadingAnimation className={ `${classes.comment} layout-column` } style={ style }>
          <LoadingPlaceholder width={ 200 } />
        </LoadingAnimation>
      )
    }

    return (
      <div className={ `${classes.comment} layout-column` } style={ style }>
        <EditorDisplay value={ comment.data.body } />
      </div>
    )
  }
}
