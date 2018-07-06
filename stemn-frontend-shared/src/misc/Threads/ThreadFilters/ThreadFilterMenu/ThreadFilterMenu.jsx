import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Item = ({ setFilter, objKey, value, filterObject, children }) => (
  <a
    onClick={ () => setFilter({ [objKey]: value }) }
    className={ filterObject && filterObject[objKey] === value ? 'active' : '' }
  >
    { children }
  </a>
)

export default class ThreadFilterMenu extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
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
    })
  }
  render() {
    const { auth, filter } = this.props
    return (
      <div className="PopoverMenu">
        <Item
          setFilter={ this.setFilter }
          filterObject={ filter.object }
          objKey="status"
          value={ 'open' }
        >
          Status: Open
        </Item>
        <Item
          setFilter={ this.setFilter }
          filterObject={ filter.object }
          objKey="status"
          value={ 'closed' }
        >
          Status: Closed
        </Item>
        <Item
          setFilter={ this.setFilter }
          filterObject={ filter.object }
          objKey="status"
          value={ undefined }
        >
          Status: All
        </Item>
        <div className="divider" />
        <Item
          setFilter={ this.setFilter }
          filterObject={ filter.object }
          objKey="user"
          value={ auth.user._id }
        >
          My Threads
        </Item>
        <Item
          setFilter={ this.setFilter }
          filterObject={ filter.object }
          objKey="user"
          value={ undefined }
        >
          All Threads
        </Item>
      </div>
    )
  }
}
