import React, { Component } from 'react'

import TagSettings from 'stemn-shared/misc/ProjectSettings/TagSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

class ProjectSettingsTags extends Component {
  render() {
    const { project, saveProject, removeField, addField } = this.props
    return (
      <div>     
        <InfoPanel>
          <TagSettings
            project={ project }
            addField={ addField }
            removeField={ removeField }
            saveProject={ saveProject }
          />
        </InfoPanel>
      </div>
    )
  }
}

export default ProjectSettingsTags
