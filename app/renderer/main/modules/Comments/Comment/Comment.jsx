// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as CommentsActions from 'app/renderer/main/modules/Comments/Comments.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './Comment.css';

// Sub Components
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import Editor from 'app/renderer/main/modules/Editor/Editor.jsx';
import EditorDisplay from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.item){
    if(!prevProps || nextProps.item._id !== prevProps.item._id){
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  confirmDelete(){
    this.props.modalActions.showConfirm({
      modalConfirm: CommentsActions.deleteComment({commentId: this.props.comment.data._id})
    })
  },
  render() {
    const { item, comment, entityModel, commentsActions } = this.props;

    if(!comment){
      return <div>Comment Loading</div>
    }

    return (
      <div className={classes.comment + ' layout-row'}>
        <div className={classes.commentAvatar}>
          <UserAvatar picture={comment.data.owner.picture} shape="square" />
        </div>
        <div className={classes.commentBody + ' flex'}>
          <div className={classes.commentHeader}>
            {comment.data.owner.name}<span className={classes.date}> <b className="text-interpunct"></b> {moment(comment.data.timestamp).fromNow()} </span>
          </div>
          <div className={classes.commentContent}>
          {
            comment.editActive
            ?
            <Editor model={`${entityModel}.data.blurb`} value={comment.data.blurb}/>
            :
            <EditorDisplay value={comment.data.blurb}/>
          }
          </div>
          <div className={classes.commentFooter}>
          {
            comment.editActive
            ?
            <div>
              <a className="link-primary" onClick={() => commentsActions.finishEdit({commentId: comment.data._id})}>Cancel</a>
              &nbsp;<b className="text-interpunct text-grey-3"></b>&nbsp;
              <a className="link-primary" onClick={() => commentsActions.saveComment({commentId: comment.data._id})}>Save</a>
            </div>
            :
            <div>
              <a className="link-primary" onClick={this.confirmDelete}>Delete</a>
              &nbsp;<b className="text-interpunct text-grey-3"></b>&nbsp;
              <a className="link-primary" onClick={() => commentsActions.startEdit({commentId: comment.data._id})}>Edit</a>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ comments }, {item}) {
  return {
    comment: comments.data[item._id],
    entityModel: `comments.data.${item._id}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commentsActions: bindActionCreators(CommentsActions, dispatch),
    modalActions    : bindActionCreators(ModalActions, dispatch),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
