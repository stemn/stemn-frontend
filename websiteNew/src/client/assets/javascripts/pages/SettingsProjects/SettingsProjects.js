import React, { Component, PropTypes } from 'react'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import SiteSearchResult from 'stemn-shared/misc/Search/SiteSearchResult'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdSettings from 'react-icons/md/settings'

class SettingsProjects extends Component {
  render() {
    const { projects } = this.props
    return (
      <div>
        <InfoPanel style={ { padding: '0px' } }>
          { projects && projects.data.map(project => (
            <SiteSearchResult result={ project } key={ project._id }>
              <SimpleIconButton
                name="projectSettingsRoute"
                params={ { projectId: project._id } }
                style={ { marginLeft: '20px' } }
              >
                <MdSettings size={ 20 } />
              </SimpleIconButton>
            </SiteSearchResult>
          ))}
        </InfoPanel>
      </div>
    )
  }
}

export default SettingsProjects
