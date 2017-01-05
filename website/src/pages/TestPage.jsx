import React, { PropTypes } from 'react';

//import Button from 'website/src/modules/AppDownloadButton/AppDownloadButton.js';
import Button from 'electron/app/renderer/main/components/Buttons/Button/Button.jsx'

//const Button = React.createClass({
//  render() {
//    const { loading, disabled, title, style, onClick, type } = this.props
//    return (
//      <button>Some Button</button>
//    );
//  }
//});

const TestPage = React.createClass({
  propTypes : {
    params  : PropTypes.object.isRequired,
  },
  render() {
    return (
      <div>
        <Button>asffsa</Button>
        <div className="md-content-container">
          This is a totally React page. Wow!
        </div>
      </div>
    )
  }
});

export default TestPage;
