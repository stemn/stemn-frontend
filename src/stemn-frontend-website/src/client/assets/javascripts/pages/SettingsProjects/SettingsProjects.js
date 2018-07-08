import React, { Component } from 'react'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import EntityRow from 'stemn-shared/misc/EntityRow'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdSettings from 'react-icons/md/settings'
import classes from './SettingsProjects.css'
import { get } from 'lodash'

class SettingsProjects extends Component {
  render() {
    const { projects } = this.props
    return (
      <div>
        <InfoPanel style={ { padding: '0px' } }>
          { get(projects, 'data', []).map(project => (
            <EntityRow data={ project } key={ project._id } nofollow className={ classes.project }>
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
