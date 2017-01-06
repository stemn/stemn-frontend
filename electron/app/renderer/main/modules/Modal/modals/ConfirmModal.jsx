// Component Core
import React from 'react';

import Button from 'electron/app/renderer/main/components/Buttons/Button/Button'

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  getInitialState () {
    return {
      value: '',
    }
  },
  onChange(event){
    this.setState({value: event.target.value});
  },
  render: function() {
    const { 
      title, message, 
      confirmValue, confirmPlaceholder,
      modalCancel, modalHide, modalConfirm 
    } = this.props;
    
    const { value } = this.state;
    
    return (
      <div style={{width: '400px'}}>
        <div className="modal-title">{title || 'Are you sure you want to do this?'}</div>
        <div className="modal-body" style={{lineHeight: '1.4em'}}>
          <div dangerouslySetInnerHTML={{__html: message || 'There will be no turning back.'}}></div>
          {confirmValue 
          ? <input 
             type="text" 
             style={{marginTop: '15px'}} 
             className="dr-input"
             placeholder={confirmPlaceholder}
             onChange={this.onChange}
            />
           : null }
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modalCancel(); modalHide()}}>Cancel</Button>
          <Button 
            className="warn" 
            disabled={confirmValue && value.toLowerCase() != confirmValue.toLowerCase() } 
            onClick={() => {modalConfirm(); modalHide()}}>
            Confirm
          </Button>
        </div>
      </div>
    )
  }
});

export default Component
