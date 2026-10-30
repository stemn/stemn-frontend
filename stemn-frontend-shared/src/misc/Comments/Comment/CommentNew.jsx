import { connect } from 'react-redux'
import { useCreateComment } from 'stemn-shared/api/queries/comments'
// Component Core
import React, { Component } from 'react'
// Styles
import cn from 'classnames'
import classes from './CommentNew.module.scss'
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
      body: '',
    }
  }
  submitNewComment = () => {
    const { threadId, timelineCacheKey, createComment } = this.props
    const { body } = this.state
    if (!body || body.length === 0) return
    createComment({ threadId, body, timelineCacheKey })
      .then(() => {
        this.setState({
          isFocussed: false,
          body: '',
        })
      })
      .catch(() => undefined) // the failure is toasted by the mutation cache; the draft is kept
  }
  clickComment = () => {
    this.props.confirmAuth(() => {
      this.setState({
        isFocussed: true,
      })
    }, true)
  }
  componentDidMount() {
    ctrlEnterHandler(this.formRef, this.submitNewComment)
  }
  render() {
    const { auth, savePending } = this.props
    const { isFocussed, body } = this.state

    return (
      <div className={cn(classes.commentNew, 'layout-row')} onClick={this.clickComment}>
        <div
          ref={(el) => {
            this.formRef = el
          }}
          className={cn(classes.commentBody, { [classes.commentBodyHidden]: !isFocussed }, 'flex')}
        >
          <div className={`${classes.commentHeader} layout-row layout-align-start-center`}>
            <UserAvatar picture={auth.user.picture} size={25} shape="square" className={classes.commentAvatar} />
            <TextSwitch height={20} swap={isFocussed}>
              <div>
                <b>New Comment</b>
              </div>
              <div>
                <b>{auth.user.name}</b>
              </div>
            </TextSwitch>
          </div>
          <div className={classes.commentContent}>
            {isFocussed ? (
              <EditorNew autoFocus={isFocussed} value={body} onChange={(value) => this.setState({ body: value })} />
            ) : null}
          </div>
          <div className="layout-row layout-align-start-end" style={{ padding: '0 20px 10px' }}>
            <MarkdownButton>Markdown formatting supported</MarkdownButton>
            <div className="flex" />
            <ProgressButton className="primary sm" loading={savePending} onClick={this.submitNewComment}>
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

const mapStateToProps = ({ auth }) => ({
  auth,
})

const mapDispatchToProps = {
  confirmAuth,
}

/** The new comment box: the body is local state, the comment is created with the comments mutation */
const CommentNewContainer = (props) => {
  const { mutateAsync, isPending } = useCreateComment()
  return <CommentNew {...props} createComment={mutateAsync} savePending={isPending} />
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentNewContainer)
