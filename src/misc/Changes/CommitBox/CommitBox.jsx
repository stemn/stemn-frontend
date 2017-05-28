// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from '../Changes.actions.js';
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { some } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './CommitBox.css';

// Sub Components
import IconButton from 'stemn-shared/misc/Buttons/IconButton';
import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx';
import Editor from 'stemn-shared/misc/Editor/EditorNew';
import Input from 'stemn-shared/misc/Input/Input/Input'
import MarkdownButton from 'stemn-shared/misc/Editor/MarkdownButton/MarkdownButton.jsx';
import Walkthrough from 'stemn-shared/misc/Walkthrough/Walkthrough.jsx'

import MdDone from 'react-icons/md/done';
import { MentionsInput, Mention } from 'react-mentions';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  render() {
    const { entityModel, changes, electronWindowsActions, changesActions, className } = this.props;
    const noChangesChecked = !some(changes.checked);
    const noSummary = !changes.summary || changes.summary.length < 1;

    const getMessage = () => {
      if(noSummary){
        return 'You must have a commit summary.'
      }
      else if(noChangesChecked){
        return 'You must select at least one change to commit.'
      }
      else {
        return 'Commit these files.'
      }
    }

    return (
      <div style={{padding: '15px'}} className={ className }>
        <Walkthrough preferPlace="right" name="commit.commitSummary">
          <Input
            autoFocus={true}
            model={`changes.${this.props.project._id}.summary`}
            value={changes.summary}
            className={classes.input}
            type="text"
            placeholder="Summary"
          />
        </Walkthrough>
        <div className="rel-box">
          <Editor
            placeholder="Detailed description"
            model={ `${entityModel}.description` }
            value={ changes.description }
            hideToolbar
            className={ classes.description }
          />
          <MarkdownButton className={ classes.markdownButton } />
        </div>
        <div className="layout-row layout-align-start-center">
          <Walkthrough preferPlace="above" name="commit.commitTasks">
            <a className="link-primary" onClick={()=> {
              electronWindowsActions.show('main');
              changesActions.mentionTasksModal({projectId: this.props.project._id});
            }}>
              <MdDone size="16" style={{marginRight: '3px', marginBottom: '2px'}}/>
              Add related tasks
            </a>
          </Walkthrough>
          <div className="flex"></div>
          <Walkthrough preferPlace="right" name="commit.commitSubmit">
            <Button
              onClick={this.props.commitFn}
              className="primary"
              disabled={noSummary || noChangesChecked}
              title={getMessage()}
            >
              Add Commit
            </Button>
          </Walkthrough>
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
