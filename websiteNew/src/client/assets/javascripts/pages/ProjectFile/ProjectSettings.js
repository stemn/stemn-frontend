import React, { Component } from 'react';

import classNames from 'classnames';
import classes from './ProjectCommit.css'

import { Row, Col, Container } from 'stemn-shared/misc/Layout';

export default class ProjectCommit extends Component {
  render() {
    const { children, project } = this.props;
    const baseUrl = `/project/${project.data._id}/settings`;
    return (
      <div className={ classes.content }>
        <Container>
          <Row className="layout-row">
            <Col style={ { width: '250px' } }>

            </Col>
            <Col className="flex">
              { children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
};

