import React, { Component } from 'react'
import { fromNow } from 'stemn-shared/utils/date'
import cn from 'classnames'
import classes from './Comment.module.css'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Editor from 'stemn-shared/misc/Editor/EditorNew'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import ReactionPopup from 'stemn-shared/misc/Reactions/ReactionPopup.jsx'
import Reactions from 'stemn-shared/misc/Reactions/Reactions.jsx'
import Popover from 'stemn-shared/misc/Popover'
import { SimpleIconButton } from 'stemn-shared/misc/Buttons/SimpleIconButton'
import { MdMoreHoriz } from 'react-icons/md'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner/IsOwner.jsx'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'

export default class Comment extends Component {
  render() {
    const {
      commentId,
      comment,
      showMeta,
      children,
      style,
      startEdit,
      finishEdit,
      changeBody,
      updateComment,
      confirmDelete,
      submitReaction,
    } = this.props

    if (!comment || !comment.data) {
      return (
        <LoadingAnimation className={`${classes.comment} layout-column`} style={style}>
          <div id={commentId} className={`${classes.commentBody} flex`}>
            <div className={`${classes.commentHeader} layout-row layout-align-start-center`}>
              <UserAvatar size={25} shape="square" className={classes.commentAvatar} />
              <LoadingPlaceholder width={200} className={classes.link} />
            </div>
            <div className={classes.commentContent}>
              <LoadingPlaceholder width={600} />
              <br />
              <LoadingPlaceholder width={300} />
              <br />
              <LoadingPlaceholder width={400} />
            </div>
          </div>
        </LoadingAnimation>
      )
    }

    const hasReactions = !comment.editActive && comment.data.reactions && comment.data.reactions.length > 0

    return (
      <div id={commentId} className={`${classes.comment} layout-column`} style={style}>
        <div className={`${classes.commentBody} flex`}>
          <div className={`${classes.commentHeader} layout-row layout-align-start-center`}>
            <Link name="userRoute" params={{ userId: comment.data.owner._id }}>
              <UserAvatar
                picture={comment.data.owner.picture}
                name={comment.data.owner.name}
                size={25}
                shape="square"
                className={classes.commentAvatar}
              />
            </Link>
            <Link name="userRoute" params={{ userId: comment.data.owner._id }}>
              <b className="text-ellipsis">{comment.data.owner.name}</b>
            </Link>
            &nbsp;
            {showMeta && children}
            <span className={cn(classes.date, 'text-ellipsis')}>&nbsp;- {fromNow(comment.data.timestamp)}</span>
            <div className="flex" />
            {!showMeta && (
              <ReactionPopup reactions={comment.data.reactions} preferPlace="above" submitFn={submitReaction} />
            )}
            {!showMeta && (
              <IsOwner ownerId={comment.data.owner._id}>
                <Popover preferPlace="right">
                  <SimpleIconButton style={{ padding: '0 0 0 5px' }}>
                    <MdMoreHoriz size="20px" />
                  </SimpleIconButton>
                  <div className="PopoverMenu">
                    {!comment.editActive && <a onClick={startEdit}>Edit</a>}
                    <a onClick={confirmDelete}>Delete</a>
                  </div>
                </Popover>
              </IsOwner>
            )}
          </div>
          <div className={classes.commentContent}>
            {comment.editActive ? (
              <Editor value={comment.form.body} onChange={changeBody} />
            ) : (
              <EditorDisplay value={comment.data.body} />
            )}
          </div>
          {comment.editActive ? (
            <div className={classes.commentFooter}>
              <div>
                <a className="link-primary" onClick={finishEdit}>
                  Cancel
                </a>
                &nbsp;
                <b className="text-interpunct text-grey-3" />
                &nbsp;
                <a className="link-primary" onClick={updateComment}>
                  Save
                </a>
              </div>
            </div>
          ) : (
            ''
          )}
          {hasReactions && (
            <div className={classes.reactions}>
              <Reactions reactions={comment.data.reactions} submitFn={submitReaction} />
            </div>
          )}
        </div>
      </div>
    )
  }
}
