// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as CommentsActions from 'app/renderer/main/modules/Comments/Comments.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';
import { actions } from 'react-redux-form';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './Comment.css';
import loadingClasses from 'app/shared/modules/Loading/LoadingPlaceholders/LoadingPlaceholders.css'

// Sub Components
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import Editor from 'app/renderer/main/modules/Editor/Editor.jsx';
import EditorDisplay from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';
import ReactionPopup from 'app/renderer/main/modules/Reactions/ReactionPopup.jsx';
import Reactions from 'app/renderer/main/modules/Reactions/Reactions.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import MdMoreHoriz from 'react-icons/md/more-horiz';


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
    this.props.modalActions.showConfirm({
      modalConfirm: {
        type: 'ALIASED',
        aliased: true,
        payload: {
          functionAlias: 'CommentsActions.deleteComment',
          functionInputs: {comment: this.props.comment.data}
        }
      }
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
            {comment.data.owner.name}<span className={classes.date}> <b className="text-interpunct"></b> {moment(comment.data.timestamp).fromNow()} </span>
            <div className="flex"></div>
            <ReactionPopup reactions={comment.data.reactions} preferPlace="above" submitFn={this.submitReaction} />
            <PopoverMenu preferPlace="right">
              <SimpleIconButton style={{padding: '0 0 0 5px'}}>
                <MdMoreHoriz size="20px"/>
              </SimpleIconButton>
              <div className="PopoverMenu">
                {comment.editActive ? null : <a onClick={() => commentsActions.startEdit({commentId: comment.data._id})}>Edit</a> }
                <a onClick={this.confirmDelete}>Delete</a>
              </div>
            </PopoverMenu>
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
