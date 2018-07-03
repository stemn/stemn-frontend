import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import TagEdit from 'stemn-shared/misc/Tags/TagEdit'
import OrganisationSearch from 'stemn-shared/misc/Search/OrganisationSearch'

export default class OrganisationSettings extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    addOrganisation: PropTypes.func.isRequired,
    removeOrganisation: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  addOrganisation = (organisation) => {
    this.props.addOrganisation({
      projectId: this.props.project.data._id,
      organisation,
    })
  }  
  removeOrganisation = (organisationId) => {
    this.props.removeOrganisation({
      projectId: this.props.project.data._id,
      organisationId,
    })
  }
  render() {
    const {
      project,
    } = this.props
    return (
      <div>
        <h3>Organisation Tags</h3>
        <p>Tag any organisations associated with this project. This can be a university, company or research institution.</p>
        <OrganisationSearch 
          cacheKey={ project.data._id }
          select={ this.addOrganisation }
        />
        <br />
        <div>
          { project.data.organisations.map(organisation => (
            <TagEdit 
              key={ organisation._id }
              text={ organisation.name }
              className="primary"
              onClick={ () => this.removeOrganisation(organisation._id) }
            />
          ))}
        </div>
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
