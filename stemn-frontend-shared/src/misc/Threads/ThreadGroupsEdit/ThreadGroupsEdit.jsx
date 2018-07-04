// Component Core
import React, { Component } from 'react'
import { connect } from 'react-redux'
import getUuid from 'stemn-shared/utils/getUuid.js'
import cn from 'classnames'
import classes from './ThreadGroupsEdit.css'
import { storeRemove, storePush } from 'stemn-shared/misc/Store/Store.actions'
import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions.js'
import Popover from 'stemn-shared/misc/Popover'
import Input from 'stemn-shared/misc/Input/Input/Input'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import pluralise from 'stemn-shared/utils/strings/pluralise'

class ThreadGroupsEdit extends Component {
  confirmDelete = (model, index) => {
    this.props.dispatch(
      showConfirm({
        message: 'If you delete this label it will be removed from all assigned threads.',
      }),
    ).then(() => {
      this.props.dispatch(storeRemove(model, index))
    })
  }
  componentWillReceiveProps(props) {
    this.onMount(props)
  }
  componentWillMount() {
    this.onMount(this.props)
  }

  onMount = (props) => {
    const { model, value, dispatch } = props
    // If it is empty, push on a label
    if (value.length === 0) {
      dispatch(storePush(model, {
        _id: getUuid(),
        color: '',
        name: '',
        threads: [],
      }))
    }
    // Else, if the name of the last label exists, add another
    else if (value[value.length - 1].name.length >= 1) {
      dispatch(storePush(model, {
        _id: getUuid(),
        color: '',
        name: '',
        threads: [],
      }))
    }
  }

  render() {
    const {
      model,
      value,
    } = this.props

    return (
      <div>
        { value.map((group, index) =>
          <div key={ group._id } className={ `${classes.row} layout-row layout-align-start-center` }>
            <div className={ `${classes.name} flex` }>
              <Input
                model={ `${model}[${index}].name` }
                value={ group.name }
                className="dr-input"
                type="text"
                placeholder="Group Name"
              />
            </div>
            <div className={ cn('dr-input', classes.threadCount) }>
              { pluralise(group.threads.length, 'Thread') }
            </div>
            <Popover preferPlace="right">
              <SimpleIconButton>
                <MdMoreHoriz size="20px" />
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a onClick={ () => this.confirmDelete(model, index) }>Remove Group</a>
              </div>
            </Popover>
          </div>,
        )}
      </div>
    )
  }
}

export default connect()(ThreadGroupsEdit)
