// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { Field } from 'react-redux-form';

// Styles
import classNames from 'classnames';
import styles from './CommitBox.css';

// Sub Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import { MdDone } from 'react-icons/lib/md';
import { MentionsInput, Mention } from 'react-mentions'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  handleChange(event, newValue, newPlainTextValue, mention){
    this.props.changesActions.descriptionChange({projectId: this.props.project._id, value: newValue})
  },
  transformDisplay: function(id, display) {
    return "@" + display
  },
  showTaskCommitModal(){
    this.props.ModalActions.showModal({
      modalType: 'TASK_COMMIT',
      modalProps: {
        projectId: this.props.project._id
      }
    })
  },
  render() {
    const data = (search, callback) => {
      return [
        {
          id: '1',
          display: search
        }, {
          id: '2',
          display: 'name2'
        }
      ]
    }
    return (
      <div className="p-15">
        <Field model={`changes.${this.props.project._id}.summary`}>
          <input className={styles.input} type="text" placeholder="Summary"/>
        </Field>

        <MentionsInput
          className={styles.mentionsBox}
          placeholder="Detailed Description"
          value={this.props.changes.description}
          displayTransform={this.transformDisplay}
          onChange={this.handleChange}>
          <Mention
          data={ data }
          style={{background: 'rgba(68, 183, 211, 0.3)'}} />
        </MentionsInput>

        <div className="layout-row layout-align-start-center">
          <a className="link-primary" onClick={this.showTaskCommitModal}>
            <MdDone size="16" style={{marginRight: '3px', marginBottom: '2px'}}/>
            Add related tasks
          </a>
          <div className="flex"></div>
          <Button className="primary">Add Commit Message</Button>
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
    ModalActions: bindActionCreators(ModalActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);


//          <IconButton onClick={()=>this.props.commitFn()}><MdDone size="22"/>Add Commit Message</IconButton>
