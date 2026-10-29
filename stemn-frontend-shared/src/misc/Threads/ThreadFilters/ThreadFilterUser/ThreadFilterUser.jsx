import React, { Component } from 'react'
import cn from 'classnames'
import { get } from 'lodash'

import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export default class ThreadFilterUser extends Component {
  setFilter = (filterObject) => {
    const { setFilter, filterCacheKey, filter, filterModel } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterObject: {
        ...filter.object,
        ...filterObject,
      },
      filterModel,
      location: 'replace',
    })
  }
  render() {
    const { project, filter, className, style } = this.props
    const userFilterOptions = [
      ...get(project, 'data.team', []).map((user) => ({
        name: user.name,
        value: user._id,
        onClick: () => {
          this.setFilter({ user: user._id })
        },
      })),
      {
        name: 'Any',
        value: undefined,
        onClick: () => {
          this.setFilter({ user: undefined })
        },
      },
    ]
    return (
      <PopoverDropdown
        className={cn('light', className)}
        style={style}
        value={get(filter, ['object', 'user'])}
        options={userFilterOptions}
      >
        Asignee:&nbsp;
      </PopoverDropdown>
    )
  }
}
