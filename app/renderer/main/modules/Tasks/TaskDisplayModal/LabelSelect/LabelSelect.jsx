import React from 'react';

import CheckboxAlt from 'app/renderer/main/components/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './LabelSelect.css'

export default class extends React.Component{
  render(){
    const { model } = this.props
    const labelInfo = [{
        value: 'question',
        name: 'Question',
        color: 'rgb(255, 65, 54)',
        textColor: 'white',
        bgColor: 'rgba(255, 65, 54, 0.1)'
    },{
        value: 'discussion',
        name: 'Discussion',
        color: 'rgb(0, 116, 217)',
        textColor: 'white',
        bgColor: 'rgba(0, 116, 217, 0.1)',
    },{
        value: 'help',
        name: 'Help Wanted',
        color: 'rgb(57, 204, 204)',
        textColor: 'white',
        bgColor:'rgba(57, 204, 204, 0.1)',
    },{
        value: 'blog',
        name: 'Blog/Update',
        color: 'rgb(255, 133, 27)',
        textColor: 'white',
        bgColor: 'rgba(255, 133, 27, 0.1)',
    },{
        value: 'bug',
        name: 'Bug',
        color: 'rgb(141, 198, 63)',
        textColor: 'white',
        bgColor: 'rgba(141, 198, 63, 0.1)',
    }]
    return (
      <div>
        {labelInfo.map((label) =>
          <CheckboxAlt model={model} value={label.value} key={label.value} className="layout-row layout-align-start-center">
            <div className={classes.swatch} style={{background: label.color}}></div>
            {label.name}
          </CheckboxAlt>
        )}
      </div>
    );
  }
};
