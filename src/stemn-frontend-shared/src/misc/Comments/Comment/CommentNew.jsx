import { connect } from 'react-redux'
// Container Actions
import { newComment } from 'stemn-shared/misc/Comments/Comments.actions.js'
// Component Core
import React, { Component } from 'react'
// Styles
import cn from 'classnames'
import classes from './CommentNew.scss'
// Sub Components
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import EditorNew from 'stemn-shared/misc/Editor/EditorNew'
import MarkdownButton from 'stemn-shared/misc/Editor/MarkdownButton/MarkdownButton.jsx'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { ctrlEnterHandler } from 'stemn-shared/misc/Forms/Forms.utils.js'
import TextSwitch from 'stemn-shared/misc/Animation/TextSwitch'
import confirmAuth from 'stemn-shared/misc/Auth/actions/confirmAuth'

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// COMPONENT /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

export class CommentNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocussed: false,
    }
  }
  submitNewComment = () => {
    const { timelineCacheKey } = this.props
    this.props.newCommentAction({
      comment: {
        thread: this.props.threadId,
        body: this.props.newComment.body,
      },
      timelineCacheKey,
    }).then(() => {
      this.setState({
        isFocussed: false,
      })
    })
  }
  clickComment = () => {
    this.props.confirmAuth(() => {
      this.setState({
        isFocussed: true,
      })
    }, true)
  }
  componentDidMount() {
    ctrlEnterHandler(this.refs.form, this.submitNewComment)
  }
  render() {
    const {
      auth,
      newComment,
      entityModel,
    } = this.props
    const { isFocussed } = this.state

    return (
      <div className={ cn(classes.commentNew, 'layout-row') } onClick={ this.clickComment }>
        <div ref="form" className={ cn(classes.commentBody, { [classes.commentBodyHidden]: !isFocussed }, 'flex') }>
          <div className={ `${classes.commentHeader} layout-row layout-align-start-center` }>
            <UserAvatar
              picture={ auth.user.picture }
              size={ 25 }
              shape="square"
              className={ classes.commentAvatar }
            />
            <TextSwitch height={ 20 } swap={ isFocussed }>
              <div><b>New Comment</b></div>
              <div><b>{ auth.user.name }</b></div>
            </TextSwitch>
          </div>
          <div className={ classes.commentContent }>
            { isFocussed
              ? <EditorNew
                autoFocus={ isFocussed }
                model={ `${entityModel}.body` }
                value={ newComment.body }
              />
              : null }
          </div>
          <div className="layout-row layout-align-start-end" style={ { padding: '0 20px 10px' } }>
            <MarkdownButton>Markdown formatting supported</MarkdownButton>
            <div className="flex" />
            <ProgressButton
              className="primary sm"
              loading={ newComment.savePending }
              onClick={ this.submitNewComment }
            >
              Comment
            </ProgressButton>
          </div>
        </div>
      </div>
    )
  }
}


// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// CONTAINER /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

function mapStateToProps({ comments, auth }, { threadId }) {
  return {
    auth,
    entityModel: `comments.threads.${threadId}.newComment`,
    newComment: comments.threads[threadId] ? comments.threads[threadId].newComment : {},
  }
}

const mapDispatchToProps = {
  newCommentAction: newComment,
  confirmAuth,
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentNew)

