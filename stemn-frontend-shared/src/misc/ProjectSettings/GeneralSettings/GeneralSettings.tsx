import * as React from 'react'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import { Col, Row } from 'stemn-shared/misc/Layout'
import LocationSearch from 'stemn-shared/misc/Search/LocationSearch'
import Upload from 'stemn-shared/misc/Upload/Upload'
import { IProject } from '../../Projects/types'
import * as classes from './GeneralSettings.scss'

export interface IGeneralSettingsProps {
  entityModel: string,
  project: {
    data: IProject,
    savePending: boolean,
  },
  saveProject: ({ project }: { project: IProject}) => void
}

export class GeneralSettings extends React.Component<IGeneralSettingsProps> {
  public saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  public render () {
    const {
      entityModel,
      project,
    } = this.props
    return (
      <div>
        <Row className='layout-xs-column layout-gt-xs-row'>
          <Col className='flex-order-xs-2 flex'>
            <h3>Project name</h3>
            <Input
              model={`${entityModel}.data.name`}
              value={project.data.name}
              className='dr-input'
              type='text'
            />
            <br />
            <h3>Summary</h3>
            <Textarea
              model={`${entityModel}.data.blurb`}
              value={project.data.blurb}
              className='dr-input'
            />
            <br />
            <h3>Location</h3>
            <LocationSearch
              cacheKey={entityModel}
              model={`${entityModel}.data.location[0]`}
              value={project.data.location[0]}
            />
            <br />
            <div className='layout-row'>
              <ProgressButton
                className='primary'
                onClick={this.saveProject}
                loading={project.savePending}
              >
                Update Project
              </ProgressButton>
            </div>
          </Col>
          <Col className='flex-order-xs-1'>
            <h3>Project Picture</h3>
            <Upload
              containerClassName={classes.container}
              imageClassName={classes.avatar}
              model={`${entityModel}.data.picture`}
              value={project.data.picture}
              uploadId={entityModel}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
