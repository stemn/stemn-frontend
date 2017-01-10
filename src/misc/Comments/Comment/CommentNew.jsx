// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as CommentsActions from 'stemn-shared/misc/Comments/Comments.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './Comment.css';

// Sub Components
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import Editor from 'stemn-shared/misc/Editor/Editor.jsx';
import MarkdownButton from 'stemn-shared/misc/Editor/MarkdownButton/MarkdownButton.jsx';
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import { ctrlEnterHandler } from 'stemn-shared/misc/Forms/Forms.utils.js'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  submitNewComment() {
    this.props.commentsActions.newComment({
      comment: {
        task: this.props.taskId,
        body: this.props.newComment.body
      }
    })
  },
  componentDidMount(){
    ctrlEnterHandler(this.refs.form, this.submitNewComment)
  },
  render() {
    const { auth, newComment, entityModel, commentsActions } = this.props;

    return (
      <div className={classes.comment + ' layout-row'}>
        <div className={classes.commentAvatar}>
          <UserAvatar picture={auth.user.picture} size="33" shape="square" />
        </div>
        <div ref="form" className={classes.commentBody + ' flex'}>
          <div className={classes.commentHeader}>
            New Comment
          </div>
          <div className={classes.commentContent}>
            <Editor autoFocus={true} model={`${entityModel}.body`} value={newComment.body} placeholder="Write a comment"/>
          </div>
          <div className="layout-row layout-align-start-end" style={{padding: '0 10px 10px'}}>
            <MarkdownButton>Markdown formatting supported</MarkdownButton>
            <div className="flex"></div>
            <Button className="primary sm"
            loading={newComment.savePending}
            onClick={this.submitNewComment}>Comment</Button>
          </div>
        </div>
      </div>
    )
  }
});





/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ comments, auth }, {taskId}) {
  return {
    auth,
    entityModel: `comments.tasks.${taskId}.newComment`,
    newComment: comments.tasks[taskId] ? comments.tasks[taskId].newComment : {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commentsActions: bindActionCreators(CommentsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

