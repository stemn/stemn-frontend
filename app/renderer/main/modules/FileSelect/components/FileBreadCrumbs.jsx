import React from 'react';

// Styles
import classNames from 'classnames';
//import classes from './FileSelect.css'

export default React.createClass({
  render() {
    const {crumbs, clickFn} = this.props;

    return (
      <div>
       {crumbs.map((item, idx)=>{
          if(idx < crumbs.length -1){
            return (
              <span>
                <a onClick={()=>clickFn({item})}>{item.text}</a>
                <span> / </span>
              </span>
            )
          }
          else{
            return(
              <span>{item.text}</span>
            )
          }
        })}
      </div>
    );
  }
});
