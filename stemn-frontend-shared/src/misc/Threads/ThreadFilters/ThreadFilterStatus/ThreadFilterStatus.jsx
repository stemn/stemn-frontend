import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { get } from 'lodash'

import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export default class ThreadFilterStatus extends Component {
  static propTypes = {
    filter: PropTypes.object.isRequired,
    filterModel: PropTypes.object.isRequired,
    filterCacheKey: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
  }
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
    const { filter, className, style } = this.props
    const filterOptionsStatus = [{
      value: undefined,
      name: 'Any',
      onClick: () => this.setFilter({ status: undefined }),
    }, {
      value: 'open',
      name: 'Open',
      onClick: () => this.setFilter({ status: 'open' }),
    }, {
      value: 'closed',
      name: 'Closed',
      onClick: () => this.setFilter({ status: 'closed' }),
    }]
    return (
      <PopoverDropdown
        className={ cn('light', className) }
        style={ style }
        value={ get(filter, ['object', 'status']) }
        options={ filterOptionsStatus }
      >
        Status:&nbsp;
      </PopoverDropdown>
    )
  }
}
