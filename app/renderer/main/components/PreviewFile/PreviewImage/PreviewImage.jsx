import React from 'react';
import styles from './PreviewImage.css';

export default class extends React.Component{
  componentDidMount() {
  }
  render() {
    return (
      <div className={styles.container + ' layout-column layout-align-center-center'}>
          <img src="https://stemn.com/api/v1/sync/download/stemn/demo files/Images/Demo.bmp?revision=5b40602372e6e" className={styles.image} />
      </div>
    )
  }
};