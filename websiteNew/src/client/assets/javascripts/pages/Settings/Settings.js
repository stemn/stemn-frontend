import React, { Component, PropTypes } from 'react';
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill';
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer';
import StandardLayout from 'layout/StandardLayout';
import { Row, Col } from 'stemn-shared/misc/Layout';

class Settings extends Component {
  render() {
    const { children } = this.props;
    return (
      <StandardLayout contained style={ { marginTop: '30px' } }>
        <Row className="layout-row">
          <Col style={ { width: '250px' } }>
            <NavPillContainer>
              <NavPill to='/settings' onlyActiveOnIndex={true}>Profile</NavPill>
              <NavPill to='/settings/account'>Account</NavPill>
              <NavPill to='/settings/emails'>Emails</NavPill>
              <NavPill to='/settings/billing'>Billing</NavPill>
              <NavPill to='/settings/projects'>Projects</NavPill>
            </NavPillContainer>
          </Col>
          <Col className="flex">
            { children }
          </Col>
        </Row>
      </StandardLayout>
    )
  }
}

export default Settings;
