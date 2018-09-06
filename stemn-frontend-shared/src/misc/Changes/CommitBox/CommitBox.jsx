// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ChangesActions from '../Changes.actions.js'
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'

// Component Core
import React from 'react'
import { some } from 'lodash'

import classes from './CommitBox.css'

import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx'
import Editor from 'stemn-shared/misc/Editor/EditorNew'
import Input from 'stemn-shared/misc/Input/Input/Input'
import MarkdownButton from 'stemn-shared/misc/Editor/MarkdownButton/MarkdownButton.jsx'
import Walkthrough from 'stemn-shared/misc/Walkthrough/Walkthrough.jsx'

import MdDone from 'react-icons/md/done'


// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// COMPONENT /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////


export class Component extends React.Component {
  render() {
    const { entityModel, changes, electronWindowsActions, changesActions, className } = this.props
    const noChangesChecked = !some(changes.checked)
    const noSummary = !changes.name || changes.name.length < 1

    const getMessage = () => {
      if (noSummary) {
        return 'You must have a commit summary.'
      } else if (noChangesChecked) {
        return 'You must select at least one change to commit.'
      }
      
      return 'Commit these files.'
    }

    return (
      <div style={ { padding: '15px' } } className={ className }>
        <Walkthrough preferPlace="right" name="commit.commitSummary">
          <Input
            autoFocus
            model={ `changes.${this.props.project._id}.name` }
            value={ changes.name }
            className={ classes.input }
            type="text"
            placeholder="Summary"
          />
        </Walkthrough>
        <div className={ classes.descriptionContainer }>
          <Editor
            placeholder="Detailed description"
            model={ `${entityModel}.body` }
            value={ changes.body }
            hideToolbar
            className={ classes.description }
          />
          <MarkdownButton className={ classes.markdownButton } />
        </div>
        <div className="layout-row layout-align-start-center">
          <Walkthrough preferPlace="above" name="commit.commitThreads">
            <a
              className="link-primary" onClick={ () => {
                electronWindowsActions.show('main')
                changesActions.mentionThreadsModal({ projectId: this.props.project._id })
              } }
            >
              <MdDone size="16" style={ { marginRight: '3px', marginBottom: '2px' } } />
              Add related threads
            </a>
          </Walkthrough>
          <div className="flex" />
          <Walkthrough preferPlace="right" name="commit.commitSubmit">
            <Button
              onClick={ this.props.commitFn }
              className="primary"
              disabled={ noSummary || noChangesChecked }
              title={ getMessage() }
            >
              Add Commit
            </Button>
          </Walkthrough>
        </div>
      </div>
    )
  }
}


// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// CONTAINER /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    electronWindowsActions: bindActionCreators(ElectronWindowsActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)


//          <IconButton ><MdDone size="22"/>Add Commit Message</IconButton>
