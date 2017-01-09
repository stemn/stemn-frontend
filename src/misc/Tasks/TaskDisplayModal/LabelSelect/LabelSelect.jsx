import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import CheckboxAlt from 'stemn-frontend-shared/src/misc/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './LabelSelect.css'

export const Component = React.createClass({
  render(){
    const { model, value, labelInfo, dispatch, onChange } = this.props;

    const filteredInfo = labelInfo.filter( label => label.name && label.color)
    return (
      <div>
        {filteredInfo.map((label) => {
          const onChangeFn = () => {
            const labelIndex = value ? value.indexOf(label._id) : -1;
            if(labelIndex != -1){
              dispatch(actions.remove(model, labelIndex))
            }
            else{
              dispatch(actions.push(model, label._id))
            }
            if(onChange){onChange()} // Run the onChange function if required
          };
          return (
            <CheckboxAlt status={value ? value.includes(label._id) : false} value={label._id} onChange={onChangeFn} className="layout-row layout-align-start-center" tickOnly={true}>
              <div className={classes.swatch} style={{background: label.color}}></div>
              {label.name}
            </CheckboxAlt>
          )
        })}
      </div>
    );
  }
});
export default connect()(Component)
