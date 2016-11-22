// Component Core
import React from 'react';
import { connect } from 'react-redux';

import getUuid from 'app/shared/helpers/getUuid.js';


// Styles
import classNames from 'classnames';
import classes from './TaskLabelsEdit.css';

// Actions
import { actions } from 'react-redux-form';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import Input from 'app/renderer/main/components/Input/Input/Input';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
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
              <PopoverMenu preferPlace="above">
                <label htmlFor={label._id} className={classes.swatch} style={{background: label.color}}/>
                <ColorSelect
                  model={`${model}[${index}].color`}
                  value={label.color}
                />
              </PopoverMenu>
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
            <PopoverMenu preferPlace="right">
              <SimpleIconButton>
                <MdMoreHoriz size="20px"/>
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a onClick={()=>this.confirmDelete(model, index)}>Remove Label</a>
              </div>
            </PopoverMenu>
          </div>
        )}
      </div>
    )
  }
});

export default connect()(Component)
