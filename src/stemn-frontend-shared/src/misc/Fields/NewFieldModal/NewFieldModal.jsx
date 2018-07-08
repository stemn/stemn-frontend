import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './NewFieldModal.css'
import cn from 'classnames'
import Form from 'stemn-shared/misc/Forms/Form'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

export default class NewFieldModal extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,  // The initial field name
    blurb: PropTypes.string,            // The initial field blurb

    // From the container
    createField: PropTypes.func.isRequired, // The create field function
    newFieldForm: PropTypes.object.isRequired, // The new field form object
    newFieldFormPending: PropTypes.bool.isRequired, // Is the form being submitted
    newFieldFormModel: PropTypes.string.isRequired, // The model
  }
  create = () => {
    this.props.createField({
      field: this.props.newFieldForm,
    }).then((response) => {
      // Return the created field to the modalConfirm
      this.props.modalConfirm(response.value.data)
    })
  }
  render() {
    const {
      newFieldForm,
      newFieldFormModel,
      newFieldFormPending,
      modalCancel,
      name,
      blurb,
    } = this.props
    const initValue = {
      name,
      blurb,
    }
    return (
      <div style={ { width: '600px' } }>
        <div className={ classes.modalTitle }>Create a new field</div>
        <div className={ classes.modalBody }>
          <Form model={ newFieldFormModel } value={ initValue } />
          <div className={ cn(classes.titleSection, 'layout-row layout-align-start-center') }>
            <Textarea
              model={ `${newFieldFormModel}.name` }
              value={ newFieldForm.name }
              className="text-title-4 input-plain flex"
              placeholder="Untitled Thread"
              autoFocus
            />
          </div>
          <div className={ classes.bodySection }>
            <Textarea
              model={ `${newFieldFormModel}.blurb` }
              className="input-plain"
              style={ { width: '100%' } }
              value={ newFieldForm.blurb }
              placeholder="Description"
            />
          </div>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            style={ { marginRight: '10px' } }
            onClick={ modalCancel }
          >
            Cancel
          </Button>
          <Button
            disabled={ newFieldFormPending }
            className="primary"
            onClick={ this.create }
          >
            Create
          </Button>
        </div>
      </div>
    )
  }
}
