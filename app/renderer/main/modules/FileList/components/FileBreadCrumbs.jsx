import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileBreadCrumbs.css';

import { middle as middleConcat } from 'app/shared/helpers/stringConcat';


export default React.createClass({
  render() {
    const {meta, clickFn} = this.props;

    const displayCrumbs = () => {
      if(meta.parents && meta.parents.length > 0){
        let crumbs = meta.parents.map((parent, idx)=>{
          return (
            <span>
              <a onClick={()=>clickFn({file: parent})}>{middleConcat(parent.name, 30, 0.8)}</a>
              <span> / </span>
            </span>
          )
        })

        crumbs.push(<span>{middleConcat(meta.name, 30, 0.8)}</span>)
        return crumbs
      }
      else if (meta.name){
        return <span>{middleConcat(meta.name, 30, 0.8)}</span>
      }
      else{
        return <span>. . .</span>
      }
    }

    return (
      <div className={classes.crumbs}>
        {displayCrumbs()}
      </div>
    );
  }
});
