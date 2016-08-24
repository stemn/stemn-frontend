import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileBreadCrumbs.css'

export default React.createClass({
  render() {
    const {parents, clickFn} = this.props;

    console.log(this.props);

    const displayCrumbs = () => {
      if(parents && parents.length > 1){
        return parents.map((parent, idx)=>{
          if(idx < parents.length -1){
            return (
              <span>
                <a onClick={()=>clickFn({parent})}>{parent.text}</a>
                <span> / </span>
              </span>
            )
          }
          else{
            return(
              <span>{parent.text}</span>
            )
          }
        })
      }
      else{
        return <span>Home</span>
      }
    }

    return (
      <div className={classes.crumbs}>
        {displayCrumbs()}
      </div>
    );
  }
});
