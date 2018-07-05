import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Upload from 'stemn-shared/misc/Upload/Upload'
import classes from './GeneralSettings.css'
import LocationSearch from 'stemn-shared/misc/Search/LocationSearch'

export default class GeneralSettings extends Component {
  static propTypes = {
    entityModel: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  render() {
    const {
      entityModel,
      project,
    } = this.props
    return (
      <div>
        <Row className="layout-xs-column layout-gt-xs-row">
          <Col className="flex-order-xs-2 flex">
            <h3>Project name</h3>
            <Input
              model={ `${entityModel}.data.name` }
              value={ project.data.name }
              className="dr-input"
              type="text"
            />
            <br />
            <h3>Summary</h3>
            <Textarea
              model={ `${entityModel}.data.blurb` }
              value={ project.data.blurb }
              className="dr-input"
            />
            <br />
            <h3>Location</h3>
            <LocationSearch
              cacheKey={ entityModel }
              model={ `${entityModel}.data.location[0]` }
              value={ project.data.location[0] }
            />
            <br />
            <div className="layout-row">
              <ProgressButton
                className="primary"
                onClick={ this.saveProject }
                loading={ project.savePending }
              >Update Project</ProgressButton>
            </div>
          </Col>
          <Col className="flex-order-xs-1">
            <h3>Project Picture</h3>
            <Upload
              containerClassName={ classes.container }
              imageClassName={ classes.avatar }
              model={ `${entityModel}.data.picture` }
              value={ project.data.picture }
              uploadId="entityModel"
            />
          </Col>
        </Row>
      </div>
    )
  }
}
