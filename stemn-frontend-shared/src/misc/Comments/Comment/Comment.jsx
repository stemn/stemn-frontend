import React, { Component } from 'react'
import moment from 'moment'
import cn from 'classnames'
import classes from './Comment.css'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Editor from 'stemn-shared/misc/Editor/EditorNew'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import ReactionPopup from 'stemn-shared/misc/Reactions/ReactionPopup.jsx'
import Reactions from 'stemn-shared/misc/Reactions/Reactions.jsx'
import Popover from 'stemn-shared/misc/Popover'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner/IsOwner.jsx'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'
import Form from 'stemn-shared/misc/Forms/Form'

export default class Comment extends Component {
  confirmDelete = () => {
    const { showConfirm, deleteComment, comment, timelineCacheKey } = this.props
    showConfirm().then(() => deleteComment({
      comment: comment.data,
      timelineCacheKey,
    }))
  }
  submitReaction = (reactionType) => {
    const { commentId, toggleReaction } = this.props
    toggleReaction({ commentId, reactionType })
  }
  startEdit = () => {
    const { startEdit, comment } = this.props
    startEdit({ commentId: comment.data._id })
  }
  finishEdit = () => {
    const { finishEdit, comment } = this.props
    finishEdit({ commentId: comment.data._id })
  }
  updateComment = () => {
    const { updateComment, comment } = this.props
    updateComment({ comment: comment.form })
  }
  render() {
    const {
      commentId,
      comment,
      showMeta,
      children,
      entityModel,
      style,
    } = this.props

    if (!comment || !comment.data) {
      return (
        <LoadingAnimation className={ `${classes.comment} layout-column` } style={ style }>
          <div id={ commentId } className={ `${classes.commentBody} flex` }>
            <div className={ `${classes.commentHeader} layout-row layout-align-start-center` }>
              <UserAvatar
                size={ 25 }
                shape="square"
                className={ classes.commentAvatar }
              />
              <LoadingPlaceholder width={ 200 } className={ classes.link } />
            </div>
            <div className={ classes.commentContent }>
              <LoadingPlaceholder width={ 600 } />
              <br />
              <LoadingPlaceholder width={ 300 } />
              <br />
              <LoadingPlaceholder width={ 400 } />
            </div>
          </div>
        </LoadingAnimation>
      )
    }

    const hasReactions = !comment.editActive && comment.data.reactions && comment.data.reactions.length > 0

    return (
      <div id={ commentId } className={ `${classes.comment} layout-column` } style={ style }>
        <div className={ `${classes.commentBody} flex` }>
          <div className={ `${classes.commentHeader} layout-row layout-align-start-center` }>
            <Link name="userRoute" params={ { userId: comment.data.owner._id } }>
              <UserAvatar
                picture={ comment.data.owner.picture }
                name={ comment.data.owner.name }
                size={ 25 }
                shape="square"
                className={ classes.commentAvatar }
              />
            </Link>
            <Link name="userRoute" params={ { userId: comment.data.owner._id } }>
              <b className="text-ellipsis">{ comment.data.owner.name }</b>
            </Link>
            &nbsp;
            { showMeta && children }
            <span className={ cn(classes.date, 'text-ellipsis') }>
              &nbsp;- { moment(comment.data.timestamp).fromNow() }
            </span>
            <div className="flex" />
            { !showMeta &&
              <ReactionPopup
                reactions={ comment.data.reactions }
                preferPlace="above"
                submitFn={ this.submitReaction }
              />
            }
            { !showMeta &&
              <IsOwner ownerId={ comment.data.owner._id }>
                <Popover preferPlace="right">
                  <SimpleIconButton style={ { padding: '0 0 0 5px' } }>
                    <MdMoreHoriz size="20px" />
                  </SimpleIconButton>
                  <div className="PopoverMenu">
                    { !comment.editActive && <a onClick={ this.startEdit }>Edit</a> }
                    <a onClick={ this.confirmDelete }>Delete</a>
                  </div>
                </Popover>
              </IsOwner>
            }
          </div>
          <div className={ classes.commentContent }>
            { comment.editActive
              ? <Form
                model={ `${entityModel}.form` }
                value={ comment.data }
              >
                { comment.form
                  ? <Editor
                    model={ `${entityModel}.form.body` }
                    value={ comment.form.body }
                  />
                  : null }
              </Form>
              : <EditorDisplay value={ comment.data.body } /> }
          </div>
          {comment.editActive ?
            <div className={ classes.commentFooter }>
              <div>
                <a className="link-primary" onClick={ this.finishEdit }>Cancel</a>
                &nbsp;<b className="text-interpunct text-grey-3" />&nbsp;
                <a className="link-primary" onClick={ this.updateComment }>Save</a>
              </div>
            </div>
            : ''}
          { hasReactions &&
            <div className={ classes.reactions }>
              <Reactions
                reactions={ comment.data.reactions }
                submitFn={ this.submitReaction }
              />
            </div>
          }
        </div>
      </div>
    )
  }
}

