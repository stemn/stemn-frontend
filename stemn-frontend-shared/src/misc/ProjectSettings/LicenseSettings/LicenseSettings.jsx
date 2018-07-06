import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import { licenseData } from 'stemn-shared/misc/Licenses/Licenses.data'

const options = licenseData.map(item => ({
  name: item.name,
  value: item.type,
}))

export default class LicenseSettings extends Component {
  static propTypes = {
    model: PropTypes.string.isRequired,
    value: PropTypes.string,
  }
  render() {
    const { model, value } = this.props
    const licenseInfo = licenseData.find(license => license.type === value)

    const getLink = () => {
      if (licenseInfo && licenseInfo.url) {
        return <a href={ licenseInfo.url  } target="_blank" className="link-primary">Learn more.</a>
      }
    }

    return (
      <div>
        <h3>Copyright License</h3>
        <p>Protect your work by selecting an appropriate license.</p>
        <PopoverDropdown
          value={ value }
          model={ model }
          options={ options }
          className="input"
          style={ { width: '100%' } }
        />
        { licenseInfo && licenseInfo.description
          ? <p>{ licenseInfo.description } { getLink() }</p>
          : null }
      </div>
    )
  }
}

