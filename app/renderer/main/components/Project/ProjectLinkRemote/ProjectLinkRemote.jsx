import React from 'react';

import RadioAlt from 'app/renderer/main/components/Input/RadioAlt/RadioAlt.jsx'

// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render(){
    const {model} = this.props
    return (
      <div>
        <RadioAlt model={model} value='dropbox'>
          Connect Dropbox
        </RadioAlt>
        <RadioAlt model={model} value='drive'>
          Connect Drive
        </RadioAlt>
        <RadioAlt model={model} value='none'>
          None
        </RadioAlt>
      </div>
    );
  }
};
