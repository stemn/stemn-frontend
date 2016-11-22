import React from 'react';

import Radio from 'app/renderer/main/components/Input/Radio/Radio.jsx'

// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render(){
    const { model, value } = this.props
    return (
      <div>
        <Radio model={model} value="public" modelValue={value}>
          Public Project (recommended)
        </Radio>
        <Radio model={model} value="private" modelValue={value}>
          Private Project
        </Radio>
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
