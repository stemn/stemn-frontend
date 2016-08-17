import React from 'react';

import RadioAlt from 'app/renderer/main/components/Input/RadioAlt/RadioAlt.jsx'
import {MdLockOutline, MdPublic} from 'react-icons/lib/md';


// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render(){
    return (
      <div>
        <RadioAlt model='projectSettings.permissions' value='public'>
          Public Project (recommended)
        </RadioAlt>
        <RadioAlt model='projectSettings.permissions' value='private'>
          Private Project
        </RadioAlt>
      </div>
    );
  }
};

//        <Radio model='projectSettings.permissions' value='public'>
//          <MdPublic style={{color: '#bbe8bb', marginRight: '10px'}} size="30"/>
//          <div className="flex">
//            <div className="text-subtitle-1">Public Project (recommended)</div>
//            <div className="text-description-1">Everyone can see this project. You choose who can collaborate.</div>
//          </div>
//        </Radio>
//        <Radio model='projectSettings.permissions' value='private'>
//          <MdLockOutline style={{color: '#f5dbab', marginRight: '10px'}} size="30"/>
//          <div className="flex">
//            <div className="text-subtitle-1">Private Project</div>
//            <div className="text-description-1">You choose who can view and who can collaborate.</div>
//          </div>
//        </Radio>
