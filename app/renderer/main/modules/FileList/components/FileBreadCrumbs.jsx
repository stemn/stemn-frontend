import React from 'react';

// Styles
import classNames from 'classnames';
//import classes from './FileSelect.css'

export default React.createClass({
  render() {
    const {crumbs, clickFn} = this.props;

    return (
      <div>
       {crumbs.map((file, idx)=>{
          if(idx < crumbs.length -1){
            return (
              <span>
                <a onClick={()=>clickFn({file})}>{file.text}</a>
                <span> / </span>
              </span>
            )
          }
          else{
            return(
              <span>{file.text}</span>
            )
          }
        })}
      </div>
    );
  }
});
