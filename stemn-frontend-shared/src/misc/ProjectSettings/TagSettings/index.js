import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import TagEdit from 'stemn-shared/misc/Tags/TagEdit'
import FieldSearch from 'stemn-shared/misc/Search/FieldSearch'

export default class GeneralSettings extends Component {
  static propTypes = {
    entityModel: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    addField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  selectField = (field) => {
    this.props.addField({
      projectId: this.props.project.data._id,
      field,
    })
  }  
  removeField = (fieldId) => {
    this.props.removeField({
      projectId: this.props.project.data._id,
      fieldId,
    })
  }
  render() {
    const {
      project,
    } = this.props
    return (
      <div>
        <h3>Field Tags</h3>
        <p>Add related field tags. These should describe the project and any skills and technologies demonstrated.</p>
        <FieldSearch 
          cacheKey={ project.data._id }
          clickResult={ this.selectField }
        />
        <br />
        <div>
          { project.data.fields.map(field => (
            <TagEdit 
              key={ field._id }
              text={ field.name }
              className="primary"
              style={ { marginBottom: '6px' } }
              onClick={ () => this.removeField(field._id) }
            />
          ))}
        </div>
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
            className="primary"
            onClick={ this.saveProject }
            loading={ project.savePending }
          >Update Project</ProgressButton>
        </div>
      </div>
    )
  }
}
