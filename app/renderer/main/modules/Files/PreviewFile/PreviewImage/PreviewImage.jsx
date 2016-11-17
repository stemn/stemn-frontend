import React from 'react';
import styles from './PreviewImage.css';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import ScrollZoom from 'app/shared/modules/scroll/ScrollZoom/ScrollZoom.jsx'

export default React.createClass({
  getInitialState () {
    return {
      loading: true,
      scale: 1
    }
  },
  onLoad() {
    this.setState({ loading: false })
  },
  zoom (direction) {
    let newValue = 0;
    if(direction == 'in'){
      newValue = Math.round( (this.state.scale * 1.1) * 100) / 100;
    }
    else{
      newValue = Math.round( (this.state.scale * 0.9) * 100) / 100;
      newValue = newValue > 0 ? newValue : this.state.scale;
    }
    this.setState({scale: newValue})
    console.log(this.state.scale);
  },
  render() {
    const { fileMeta, project } = this.props;
    const { scale } = this.state;
    const fileUrl = `${process.env.API_SERVER}/api/v1/remote/download/${project._id}/${fileMeta.fileId}?revisionId=${fileMeta.revisionId}`;

    const sizeStyles = {
      transform: `scale(${scale})`
    }
    return (
      <div className={styles.container + ' layout-column layout-align-center-center flex'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out')}>
          <img src={fileUrl}
            className={styles.image}
            onLoad={this.onLoad}
            style={sizeStyles}
          />
        </ScrollZoom>
        <LoadingOverlay show={this.state.loading} />
      </div>
    )
  }
});
