// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from '../Changes.actions.js';
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './CommitBox.css';

// Sub Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import Editor from 'app/renderer/main/modules/Editor/Editor.jsx';
import Input from 'app/renderer/main/components/Input/Input/Input'
import MarkdownButton from 'app/renderer/main/modules/Editor/MarkdownButton/MarkdownButton.jsx';

import MdDone from 'react-icons/md/done';
import { MentionsInput, Mention } from 'react-mentions';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  render() {
    const { entityModel, changes, electronWindowsActions, changesActions } = this.props;
    return (
      <div className="p-15">
          <Input 
            autoFocus={true}
            model={`changes.${this.props.project._id}.summary`} 
            value={changes.summary} 
            className={classes.input} 
            type="text" 
            placeholder="Summary"
          />
        <div className="rel-box">
          <Editor
            placeholder="Detailed description"
            model={`${entityModel}.description`}
            value={changes.description}
            className={classes.description}
          />
          <MarkdownButton style={{position: 'absolute', bottom: '2px', right: '5px'}} />
        </div>
        <div className="layout-row layout-align-start-center">
          <a className="link-primary" onClick={()=> {
            electronWindowsActions.show('main');
            changesActions.mentionTasksModal({projectId: this.props.project._id});
          }}>
            <MdDone size="16" style={{marginRight: '3px', marginBottom: '2px'}}/>
            Add related tasks
          </a>
          <div className="flex"></div>
          <Button
          onClick={this.props.commitFn}
          className="primary"
          disabled={!changes.summary || changes.summary.length < 1}
          >Add Commit</Button>
        </div>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    electronWindowsActions: bindActionCreators(ElectronWindowsActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);


//          <IconButton ><MdDone size="22"/>Add Commit Message</IconButton>
