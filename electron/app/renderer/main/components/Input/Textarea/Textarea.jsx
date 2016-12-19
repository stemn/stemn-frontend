import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import Textarea from 'react-textarea-autosize';

class Component extends React.Component{
  render(){
    const { model, value, dispatch, className, placeholder, style, onChange } = this.props;
    return (
      <Textarea style={style}
        className={className}
        onChange={(e) => {
          dispatch(actions.change(model, e));
          if(onChange){ onChange() };
        }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
};

export default connect(s => s)(Component);
