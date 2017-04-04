import React, { Component } from 'react';

import classNames from 'classnames';
import classes from './ProjectsTasks.css'

import { Row, Col, Container } from 'stemn-shared/misc/Layout';

export default class ProjectsTasks extends Component {
  render() {
    const { project } = this.props;
    const baseUrl = `/project/${project.data._id}/settings`;
    return (
      <div className={ classes.content }>
        <Container>
          <Row className="layout-row">
            <Col className="flex">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit voluptatum, quo doloribus tempore magnam nihil fugiat ex ullam optio recusandae, corrupti repellendus veniam velit. Ad consectetur sint provident, saepe inventore.
            </Col>
            <Col style={ { width: '250px' } }>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure unde, saepe temporibus laudantium totam ipsam officiis labore repellat voluptate omnis dicta placeat doloribus, ducimus, velit deleniti ullam quis in odio!
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
};

