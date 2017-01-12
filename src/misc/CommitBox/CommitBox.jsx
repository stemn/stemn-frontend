import React from 'react';

import classNames from 'classnames';
import styles from './CommitBox.css';
import Input from 'stemn-shared/misc/Input/Input/Input';

// Components
import IconButton from 'stemn-shared/misc/Buttons/IconButton';
import MdDone from 'react-icons/md/done';
import { MentionsInput, Mention } from 'react-mentions'

export default React.createClass({
  transformDisplay: function(id, display) {
    return "@" + display
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
      <div style={{padding: '15px'}}>
        <Input
          model={`changes.${this.props.project._id}.summary`}
          value={this.props.changes.summary}
          className={styles.input}
          type="text"
          placeholder="Summary"
        />
        <div className={classNames(styles.container, {[styles.containerShow]: this.props.changes.summary && this.props.changes.summary.length > 0})}>
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

          <div className="layout-row layout-align-center">
            <IconButton onClick={()=>this.props.commitFn()}><MdDone size="22"/>Add Commit Message</IconButton>
          </div>
        </div>
      </div>
    );
  }
})
