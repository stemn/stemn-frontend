import React from 'react';
import styles from './PreviewImage.css';

export default class extends React.Component{
  render() {
    const {file, project} = this.props;
    const fileUrl = `http://localhost:3000/api/v1/remote/download/${project._id}/${file.fileId}?revisionId=${file.revisionId}`;

    return (
      <div className={styles.container + ' layout-column layout-align-center-center flex'}>
        <img src={fileUrl} className={styles.image} />
      </div>
    )
  }
};
