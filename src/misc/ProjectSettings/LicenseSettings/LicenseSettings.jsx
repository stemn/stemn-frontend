import React, { Component, PropTypes } from 'react';
import Select from 'stemn-shared/misc/Input/Select'
import { licenseData } from 'stemn-shared/misc/Licenses/Licenses.data'

const options = licenseData.map(item => ({
  label: item.name,
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
        <Select
          value={ value }
          model={ model }
          options={ options }
        />
        { licenseInfo && licenseInfo.description
        ? <p>{ licenseInfo.description } { getLink() }</p>
        : null }
      </div>
    )
  }
}


