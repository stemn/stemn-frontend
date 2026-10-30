import React from 'react'
import { connect } from 'react-redux'

import { storeRemove, storePush } from 'stemn-shared/misc/Store/Store.actions'
import UserMinimalRow from 'stemn-shared/misc/Users/UserMinimalRow'
import { MdClose } from 'react-icons/md'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

class Component extends React.Component {
  remove = (idx) => {
    const { dispatch, model, onChange, value } = this.props
    // Model-bound use writes the store; controlled use (no model) only gets onChange(newUsers)
    if (model) dispatch(storeRemove(model, idx))
    if (onChange) {
      onChange(value.filter((_user, index) => index !== idx))
    }
  }

  render() {
    const { model, value, users, dispatch, onChange } = this.props
    const valueIds = value.map((val) => val._id)
    // Filter the users by ones that are in the value
    const usersFiltered = users.filter((user) => !valueIds.includes(user._id))
    // Construct the options, ignore already selected users
    const userOptions = usersFiltered.map((user) => ({
      value: user._id,
      name: user.name,
      onClick: () => {
        if (model) dispatch(storePush(model, user))

        if (onChange) {
          onChange([...value, user])
        }
      },
    }))

    const userOptionsWithEmpty =
      userOptions.length === 0
        ? [
            {
              name: 'No Results',
              value: 'empty',
            },
          ]
        : userOptions

    return (
      <div className="layout-column">
        <PopoverDropdown options={userOptionsWithEmpty} classname="light" style={{ width: '100%' }} empty>
          Select Assignees
        </PopoverDropdown>
        <br />
        {value.map((user, idx) => (
          <UserMinimalRow key={user._id} user={user} noLink>
            <a onClick={() => this.remove(idx)}>
              <MdClose />
            </a>
          </UserMinimalRow>
        ))}
      </div>
    )
  }
}

export default connect()(Component)
