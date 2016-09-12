// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as CommentsActions from 'app/renderer/main/modules/Comments/Comments.actions.js';

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
import Button from 'app/renderer/main/components/Buttons/Button/Button'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    const { auth, value, entityModel, commentsActions } = this.props;

    return (
      <div className={classes.comment + ' layout-row'}>
        <div className={classes.commentAvatar}>
          <UserAvatar picture={auth.user.picture} size="33" shape="square" />
        </div>
        <div className={classes.commentBody + ' flex'}>
          <div className={classes.commentHeader}>
            New Comment
          </div>
          <div className={classes.commentContent}>
            <Editor model={`${entityModel}.data.blurb`} value={value.blurb}/>
          </div>
          <div className="layout-row" style={{padding: '0 10px 10px'}}>
            <div className="flex"></div>
            <Button className="primary sm">Comment</Button>
          </div>
        </div>
      </div>
    )
  }
});





/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ comments, auth }, {item}) {
  return {
    auth,
    entityModel: `comments`,
    value: {}
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commentsActions: bindActionCreators(CommentsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

