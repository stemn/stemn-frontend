import * as React from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'
import { JsonSchemaForm } from 'stemn-shared/misc/JsonSchemaForm'
import { Col, Row } from 'stemn-shared/misc/Layout/index.js'
import {
  PipelineGraphSidebarWidget,
} from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphSidebar/PipelineGraphSidebarWidget'
import { IPipelineConfigStepBase, IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx'

import * as s from './PipelineGraphSidebar.scss'

export interface IPipelineGraphSidebarProps {
  diagramId: string,
  selectedStep?: IPipelineConfigStepBase,
  steps: IStep[]
}

export class PipelineGraphSidebarComponent extends React.PureComponent<IPipelineGraphSidebarProps> {
  public render () {
    const { selectedStep, steps } = this.props

    if (selectedStep) {
      const stepInfo = steps.find((step) => step.type === selectedStep.type)
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px' }}>Edit Node</SectionTitle>
          { selectedStep.type }
          { stepInfo && stepInfo.schema && (
            <JsonSchemaForm
              schema={ stepInfo.schema }
              onSubmit={ (data) => data }
            />
          )}
        </div>
      )
    } else {
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px' }}>Name</SectionTitle>
          <Input className='dr-input' model='test' />
          <SectionTitle className={ s.sidebarTitle }>Triggers</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            { steps
              .filter((step) => step.category === 'trigger')
              .map((step) => <Col className='sm' key={ step.type }><PipelineGraphSidebarWidget step={ step }/></Col>)
            }
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Conditions</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            { steps
              .filter((step) => step.category === 'condition')
              .map((step) => <Col className='sm' key={ step.type }><PipelineGraphSidebarWidget step={ step }/></Col>)
            }
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Actions</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            { steps
              .filter((step) => step.category === 'action')
              .map((step) => <Col className='sm' key={ step.type }><PipelineGraphSidebarWidget step={ step }/></Col>)
            }
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Custom Step</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            { steps
              .filter((step) => step.category === 'custom')
              .map((step) => <Col className='sm' key={ step.type }><PipelineGraphSidebarWidget step={ step }/></Col>)
            }
          </Row>
        </div>
      )
    }
  }
}
