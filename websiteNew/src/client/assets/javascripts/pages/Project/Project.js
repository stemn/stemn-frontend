import React, { Component, PropTypes } from 'react';
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill';
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer';
import { Container, Row, Col } from 'stemn-shared/misc/Layout';

class Settings extends Component {
  render() {
    return (
      <Container style={ { marginTop: '30px' } }>
        <Row className="layout-row">
          <Col style={ { width: '300px' } }>
            <NavPillContainer>
              <NavPill>Profile</NavPill>
              <NavPill className='active'>Account</NavPill>
              <NavPill>Emails</NavPill>
              <NavPill>Billing</NavPill>
              <NavPill>Projects</NavPill>
              <NavPill>Organisations</NavPill>
            </NavPillContainer>
          </Col>
          <Col className="flex">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe hic sed aliquam atque nisi veritatis, praesentium aut officia nulla voluptas nesciunt eaque, nostrum a dolorum nam aspernatur facilis ab ad?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe hic sed aliquam atque nisi veritatis, praesentium aut officia nulla voluptas nesciunt eaque, nostrum a dolorum nam aspernatur facilis ab ad?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe hic sed aliquam atque nisi veritatis, praesentium aut officia nulla voluptas nesciunt eaque, nostrum a dolorum nam aspernatur facilis ab ad?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe hic sed aliquam atque nisi veritatis, praesentium aut officia nulla voluptas nesciunt eaque, nostrum a dolorum nam aspernatur facilis ab ad?</p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Settings;