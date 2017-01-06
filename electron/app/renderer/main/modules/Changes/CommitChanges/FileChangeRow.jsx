import React from 'react';
import classNames from 'classnames';

// Components
import Checkbox from 'electron/app/renderer/main/components/Input/Checkbox/Checkbox';
import TogglerExpand from 'electron/app/renderer/main/components/Toggler/TogglerExpand/TogglerExpand.jsx';
import { middle as middleConcat } from 'electron/app/shared/helpers/stringConcat';

// Styles
import styles from './FileChangeRow.css';

export default React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const { item, model, value, text, clickFn, isActive } = this.props;
    const { isOpen } = this.state;
    // Classes
    const rowClasses = classNames({
      [styles.fileChangeRow]: true,
      [styles.active]: isActive,
      'layout-row' : true,
      'layout-align-start-center' : true
    });

    // Template
    return (
      <div className={rowClasses}>
        <div className={styles.checkbox}>
          <Checkbox model={model} value={value} title={value ? 'Deselect change' : 'Select change'}/>
        </div>
        <div className={styles.text + ' flex text-ellipsis layout-row'} onClick={clickFn}>
          <div className="flex" title={text}>{middleConcat(text, 60, 0.5)}</div>
        </div>
      </div>
    )
  }
})

//          <TogglerExpand isActive={isOpen} onClick={()=>this.toggle(null)}>
//            {item.revisions.length}
//          </TogglerExpand>
