import React          from 'react';
import Radio          from 'stemn-frontend-shared/src/misc/Input/Radio/Radio.jsx'
import MdPublic       from 'react-icons/md/public';
import MdLockOutline  from 'react-icons/md/lock-outline';

// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render(){
    const { model, value } = this.props
    return (
      <div>
        <Radio model={model} value="public" modelValue={value}>
          <MdPublic style={{color: '#bbe8bb', marginRight: '10px'}} size="30"/>
          <div className="flex">
            <div className="text-subtitle-1">Public Project (recommended)</div>
            <div className="text-description-1">Everyone can see this project. You choose who can collaborate.</div>
          </div>
        </Radio>
        <Radio model={model} value="private" modelValue={value}>
          <MdLockOutline style={{color: '#f5dbab', marginRight: '10px'}} size="30"/>
          <div className="flex">
            <div className="text-subtitle-1">Private Project</div>
            <div className="text-description-1">You choose who can view and who can collaborate.</div>
          </div>
        </Radio>
      </div>
    );
  }
};
