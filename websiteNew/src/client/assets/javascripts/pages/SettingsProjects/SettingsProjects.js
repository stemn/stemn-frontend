import React, { Component, PropTypes } from 'react'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import EntityRow from 'stemn-shared/misc/EntityRow'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdSettings from 'react-icons/md/settings'

class SettingsProjects extends Component {
  render() {
    const { projects } = this.props
    return (
      <div>
        <InfoPanel style={ { padding: '0px' } }>
          { projects && projects.data.map(project => (
            <EntityRow data={ project } key={ project._id } nofollow>
              <SimpleIconButton
                name="projectSettingsRoute"
                params={ { projectId: project._id } }
                style={ { marginLeft: '20px' } }
              >
                <MdSettings size={ 20 } />
              </SimpleIconButton>
            </EntityRow>
          ))}
        </InfoPanel>
      </div>
    )
  }
}

export default SettingsProjects
