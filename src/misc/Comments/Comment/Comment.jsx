// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as CommentsActions from 'stemn-shared/misc/Comments/Comments.actions.js';
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js';
import { actions } from 'react-redux-form';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './Comment.css';
import loadingClasses from 'stemn-shared/misc/Loading/LoadingPlaceholders/LoadingPlaceholders.css'

// Sub Components
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import Editor from 'stemn-shared/misc/Editor/Editor.jsx';
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx';
import ReactionPopup from 'stemn-shared/misc/Reactions/ReactionPopup.jsx';
import Reactions from 'stemn-shared/misc/Reactions/Reactions.jsx';
import Popover from 'stemn-shared/misc/Popover';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz';
import IsOwner from 'stemn-shared/misc/Auth/IsOwner/IsOwner.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(!prevProps || nextProps.commentId !== prevProps.commentId){
    nextProps.commentsActions.getComment({commentId: nextProps.commentId})
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  confirmDelete(){
    this.props.modalActions.showConfirm()
      .then(() => {
        this.props.commentsActions.deleteComment({
          comment: this.props.comment.data
        })
    })
  },
  submitReaction(reactionType){
    this.props.commentsActions.toggleReaction({
      commentId: this.props.commentId,
      reactionType
    })
  },
  render() {
    const { item, comment, entityModel, commentsActions, style } = this.props;

    if(!comment || !comment.data){
      return (
        <div className={classNames(classes.comment, loadingClasses.loading, 'layout-row')} style={style}>
          <div className={classes.commentAvatar}>
            <UserAvatar size="33" shape="square" />
          </div>
          <div className={classes.commentBody + ' flex'}>
            <div className={classes.commentHeader}>
              Somebodys name
            </div>
            <div className={classes.commentContent}>
              Some dummy goes here. This text should be obscured by the blokk font.
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={classes.comment + ' layout-row'} style={style}>
        <div className={classes.commentAvatar}>
          <UserAvatar picture={comment.data.owner.picture} size="33" shape="square" />
        </div>
        <div className={classes.commentBody + ' flex'}>
          <div className={classes.commentHeader + ' layout-row layout-align-start-center'}>
            <b>{ comment.data.owner.name }</b>
            <span className={classes.date}>&nbsp;<b className="text-interpunct"></b> {moment(comment.data.timestamp).fromNow()} </span>
            <div className="flex"></div>
            <ReactionPopup reactions={comment.data.reactions} preferPlace="above" submitFn={this.submitReaction} />
            <IsOwner ownerId={comment.data.owner._id}>
              <Popover preferPlace="right">
                <SimpleIconButton style={{padding: '0 0 0 5px'}}>
                  <MdMoreHoriz size="20px"/>
                </SimpleIconButton>
                <div className="PopoverMenu">
                  {comment.editActive ? null : <a onClick={() => commentsActions.startEdit({commentId: comment.data._id})}>Edit</a> }
                  <a onClick={this.confirmDelete}>Delete</a>
                </div>
              </Popover>
            </IsOwner>
          </div>
          <div className={classes.commentContent}>
          {
            comment.editActive
            ?
            <Editor model={`${entityModel}.data.body`} value={comment.data.body}/>
            :
            <EditorDisplay value={comment.data.body}/>
          }
          </div>
          {comment.editActive ?
            <div className={classes.commentFooter}>
              <div>
                <a className="link-primary" onClick={() => commentsActions.finishEdit({commentId: comment.data._id})}>Cancel</a>
                &nbsp;<b className="text-interpunct text-grey-3"></b>&nbsp;
                <a className="link-primary" onClick={() => commentsActions.updateComment({comment: comment.data})}>Save</a>
              </div>
            </div>
          : ''}
          {!comment.editActive && comment.data.reactions && comment.data.reactions.length > 0 ?
            <div><Reactions reactions={comment.data.reactions} /></div>
          : ''}
        </div>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ comments }, {commentId}) {
  return {
    comment: comments.data[commentId],
    entityModel: `comments.data.${commentId}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commentsActions : bindActionCreators(CommentsActions, dispatch),
    modalActions    : bindActionCreators(ModalActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
