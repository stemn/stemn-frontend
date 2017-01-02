import http from 'axios';
import React from 'react';

const moduleName = 'appDownloadButton'
const AppDownloadButton = React.createClass({
  propTypes: {
    os : React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return { downloadUrl: '' };
  },
  componentWillMount() {
    const { os } = this.props;
    http({
      url: 'https://api.github.com/repos/Stemn/Stemn-Desktop/releases?per_page=1'
    }).then(response => {
      const assets = response.data[0].assets;
      const osToFile = {
        mac     : 'dmg',
        windows : 'exe',
        linux   : 'AppImage'
      };
      const asset = assets.find(asset => asset.name.endsWith(osToFile[os]));
      this.setState({downloadUrl: asset.browser_download_url})
    })
  },
  render() {
    const { downloadUrl } = this.state;
    return <a download href={downloadUrl}>Download</a>;
  }
})

angular.module(moduleName, []);
angular.module(moduleName).
directive('appDownloadButton', (reactDirective) => reactDirective(AppDownloadButton));

export default moduleName
