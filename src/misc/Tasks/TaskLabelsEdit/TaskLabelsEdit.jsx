// Component Core
import React from 'react';
import { connect } from 'react-redux';

import getUuid from 'stemn-shared/utils/getUuid.js';


// Styles
import classNames from 'classnames';
import classes from './TaskLabelsEdit.css';

// Actions
import { actions } from 'react-redux-form';
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js';

import Popover from 'stemn-shared/misc/Popover';
import Input from 'stemn-shared/misc/Input/Input/Input';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz';
import ColorSelect from './ColorSelect/ColorSelect.jsx'


export const Component = React.createClass({
  confirmDelete(model, index){
    this.props.dispatch(
      ModalActions.showConfirm({
        message: 'If you delete this label it will be removed from all assigned tasks.',
        modalConfirm: {
          type: 'ALIASED',
          aliased: true,
          payload: {
            functionAlias: 'FormActions.remove',
            functionInputs: [ model, index ]
          }
        }
      })
    )
  },

  render() {
    const { model, value, dispatch } = this.props;

    // If it is empty, push on a label
    if(value.length == 0){
      dispatch(actions.push(model, {
        _id: getUuid(),
        color: '',
        name: '',
      }))
    }
    // Else, if the name of the last label exists, add another
    else if(value[value.length-1].name.length >= 1){
      dispatch(actions.push(model, {
        _id: getUuid(),
        color: '',
        name: '',
      }))
    }

    return (
      <div>
        {value.map((label, index)=>
          <div key={label._id} className={classes.row + ' layout-row layout-align-start-center'}>
            <div className={classes.colorSelect}>
              <Popover preferPlace="above">
                <label htmlFor={label._id} className={classes.swatch} style={{background: label.color}}/>
                <ColorSelect
                  model={`${model}[${index}].color`}
                  value={label.color}
                />
              </Popover>
              <Input
                model={`${model}[${index}].color`}
                value={label.color}
                className={classes.colorSelectInput + ' dr-input'}
                type="text"
                placeholder="Color Code"
                id={label._id}
              />
            </div>

            <div className={classes.name + ' flex'}>
              <Input
                model={`${model}[${index}].name`}
                value={label.name}
                className="dr-input"
                type="text"
                placeholder="Label Name"
              />
            </div>
            <Popover preferPlace="right">
              <SimpleIconButton>
                <MdMoreHoriz size="20px"/>
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a onClick={()=>this.confirmDelete(model, index)}>Remove Label</a>
              </div>
            </Popover>
          </div>
        )}
      </div>
    )
  }
});

export default connect()(Component)
