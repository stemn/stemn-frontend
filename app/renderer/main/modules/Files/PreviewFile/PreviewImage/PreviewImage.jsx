import React from 'react';
import styles from './PreviewImage.css';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default React.createClass({
  getInitialState () {
    return {
      loading: true
    }
  },
  onLoad() {
    this.setState({ loading: false })
  },
  render() {
    const {fileMeta, project} = this.props;
    const fileUrl = `http://localhost:3000/api/v1/remote/download/${project._id}/${fileMeta.fileId}?revisionId=${fileMeta.revisionId}`;
    return (
      <div className={styles.container + ' layout-column layout-align-center-center flex'}>
        <img src={fileUrl}
        className={styles.image}
        onLoad={this.onLoad} />
        <LoadingOverlay show={this.state.loading} />
      </div>
    )
  }
});
