
import React from 'react';

// Components
import Checkbox from 'electron/app/renderer/main/components/Input/Checkbox/Checkbox';
import Walkthrough from 'electron/app/shared/modules/Walkthrough/Walkthrough.jsx'

// Styles
import styles from './FileChangeTitleRow.css';

export default React.createClass({
  render(){
    const { model, value, checkbox, changeAction, children, text } = this.props;
    return (
      <div className={styles.fileChangeTitleRow + ' layout-row layout-align-start-center'}>
        {checkbox
        ? <Walkthrough name="commit.commitCheckbox" preferPlace="right">
            <Checkbox className="text-primary" model={model} value={value} changeAction={changeAction} title="Toggle all"/>
          </Walkthrough>
        : null}
        <span className={styles.text + ' flex text-ellipsis'}>{text}</span>
        <div className="flex"></div>
        {children}
      </div>
    )
  }
});
