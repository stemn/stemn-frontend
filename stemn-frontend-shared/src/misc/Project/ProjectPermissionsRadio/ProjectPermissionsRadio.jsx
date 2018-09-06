import React from 'react'
import Radio from 'stemn-shared/misc/Input/Radio/Radio.jsx'
import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'

export default class ProjectPermissionsRadio extends React.Component {
  render() {
    const { model, value } = this.props
    return (
      <div>
        <Radio model={ model } value={ false } modelValue={ value }>
          <PublicPrivateIcon style={ { marginRight: '10px' } } size={ 30 } />
          <div className="flex">
            <div className="text-subtitle-1">Public Project (recommended)</div>
            <div className="text-description-1">Everyone can see this project. You choose who can collaborate.</div>
          </div>
        </Radio>
        <Radio model={ model } value modelValue={ value }>
          <PublicPrivateIcon private style={ { marginRight: '10px' } } size={ 30 } />
          <div className="flex">
            <div className="text-subtitle-1">Private Project</div>
            <div className="text-description-1">You choose who can view and who can collaborate.</div>
          </div>
        </Radio>
      </div>
    )
  }
}
