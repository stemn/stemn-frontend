import React from 'react';
import styles from './CommitBox.css';

// Components
import IconButton from '../Buttons/IconButton';
import {MdDone} from 'react-icons/lib/md';


export default class Commit extends React.Component {

  constructor(props) {
    super(props);
    this.commitFiles = this.commitFiles.bind(this);
  }

  commitFiles() {
    if(this.name.value && this.description.value){
      this.props.commitFiles([], {
        name: this.name.value,
        description: this.description.value
      })
      this.name.value = '';
      this.description.value = '';
    }
  }

  render() {
    return (
      <div className="p-15">
        <input className={styles.input} type="text" placeholder="Summary" ref={node => {
          this.name = node;
        }} />
        <textarea className={styles.textarea} placeholder="Detailed Description" ref={node => {
              this.description = node;
        }} ></textarea>

        <div className="layout-row layout-align-center">
          <IconButton onClick={this.CommitFiles}><MdDone size="22"/>Add Commit Message</IconButton>
        </div>
      </div>
    );
  }
}
