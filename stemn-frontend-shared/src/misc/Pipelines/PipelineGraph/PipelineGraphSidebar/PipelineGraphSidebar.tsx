import * as React from 'react'
import * as s from './PipelineGraphSidebar.scss'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx'
import { PipelineGraphSidebarWidget } from './PipelineGraphSidebarWidget'
import { Row, Col } from 'stemn-shared/misc/Layout/index.js'

export interface IPipelineGraphSidebarProps {
  diagramId: string,
}


export class PipelineGraphSidebarComponent extends React.PureComponent<IPipelineGraphSidebarProps> {
  render() {
    const { selectedStep } = this.props

    if (selectedStep) {
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px'}}>Edit Node</SectionTitle>
          { selectedStep.type }
        </div>
      )
    } else {
      return (
        <div>
          <SectionTitle className={ s.sidebarTitle } style={{ marginTop: '0px'}}>Triggers</SectionTitle>
          <Row className="layout-row layout-wrap sm">
            {[1,2,3].map((item) => <Col className="sm" key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Conditions</SectionTitle>
          <Row className="layout-row layout-wrap sm">
            {[1,2,3,4,5,6].map((item) => <Col className="sm" key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
          <SectionTitle className={ s.sidebarTitle }>Actions</SectionTitle>
          <Row className="layout-row layout-wrap sm">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((item) => <Col className="sm" key={ item }><PipelineGraphSidebarWidget /></Col>)}
          </Row>
        </div>
      )
    }
  }
}
