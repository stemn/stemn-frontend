import React from 'react'
import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import Textarea from 'react-textarea-autosize'

class Component extends React.Component{
  getTextareaRef = (ref) => {
    if (ref) {
      ref.focus()
    }
  }
  render(){
    const { model, dispatch, onChange, ...otherProps } = this.props;
    return (
      <Textarea
        ref={ this.getTextareaRef }
        onChange={(event) => {
          dispatch(storeChange(model, event.target.value));
          if(onChange){ onChange() };
        }}
        { ...otherProps }
      />
    );
  }
};

export default connect()(Component)
