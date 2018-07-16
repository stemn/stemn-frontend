import * as React from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'
import { JsonSchemaForm } from 'stemn-shared/misc/JsonSchemaForm'
import { schema } from 'stemn-shared/misc/JsonSchemaForm/exampleSchema'
import { Col, Row } from 'stemn-shared/misc/Layout/index.js'
import {
  PipelineGraphSidebarWidget,
} from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphSidebar/PipelineGraphSidebarWidget'
import { IPipelineConfigStepBase } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx'

import * as s from './PipelineGraphSidebar.scss'

export interface IPipelineGraphSidebarProps {
  diagramId: string,
  selectedStep?: IPipelineConfigStepBase,
}

export class PipelineGraphSidebarComponent extends React.PureComponent<IPipelineGraphSidebarProps> {
  public render () {
    const { selectedStep } = this.props

    if (selectedStep) {
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px' }}>Edit Node</SectionTitle>
          { selectedStep.type }
          <JsonSchemaForm
            schema={ schema }
            onSubmit={ (data) => data }
          />
        </div>
      )
    } else {
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px' }}>Name</SectionTitle>
          <Input className='dr-input' model='test' />
          <SectionTitle className={ s.sidebarTitle }>Triggers</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            {[1,2,3].map((item) => <Col className='sm' key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Conditions</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            {[1,2,3,4,5,6].map((item) => <Col className='sm' key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Actions</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((item) => <Col className='sm' key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Custom Step</SectionTitle>
          <Row className='layout-row layout-wrap sm'>
            {[1].map((item) => <Col className='sm' key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
        </div>
      )
    }
  }
}
