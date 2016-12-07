// Component Core
import React from 'react';

import Button from 'app/renderer/main/components/Buttons/Button/Button'

import MagnifyInternet   from 'app/renderer/assets/images/pure-vectors/magnify-internet.svg';
import StandardTable from 'app/shared/modules/Tables/StandardTable/StandardTable.jsx'

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  render: function() {
    const { modalCancel, modalHide, modalConfirm } = this.props;
    const { provider } = this.props;
    const providerText = provider == 'drive' ? 'Google Drive' : 'Dropbox';
    return (
      <div style={{width: '600px'}}>
        <div className="modal-title">
          This revision has expired
        </div>
        <div className="modal-body" style={{lineHeight: '1.4em'}}>
          <div>{providerText} only stores a 30 day file history for accounts on their free plan.</div>
          <br/>
          <StandardTable>
            <thead>
              <tr>
                <td style={{width: '33%'}}>Cloud Provider</td>
                <td style={{width: '33%'}}>Plan: Free</td>
                <td style={{width: '33%'}}>Plan: Pro</td>
              </tr>
            </thead>
            <tbody>
              {provider == 'drive'
              ? <tr>
                  <td>Google Drive</td>
                  <td>30 days</td>
                  <td>Infinite</td>
                </tr>
              : <tr>
                  <td>Dropbox</td>
                  <td>30 days</td>
                  <td>30 days (Infinite on a <a href="https://www.dropbox.com/plans" className="link-primary">business plan</a>)</td>
                </tr>
              }
            </tbody>
          </StandardTable>
          <br/>
          There are 3 ways to access infinite revision history.
          <br/>
          <br/>
          <StandardTable>
            <tbody>
              <tr>
                <td><b>Method 1 (coming soon)</b></td>
                <td>Change your project to an open-source 'Public' project.</td>
              </tr>
              <tr>
                <td><b>Method 2 (coming soon)</b></td>
                <td>Upgrade to Stemn Pro.</td>
              </tr>
              <tr>
                <td><b>Method 3</b></td>
                <td>Upgrade {providerText} to a pro account.</td>
              </tr>

            </tbody>
          </StandardTable>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            className="primary"
            onClick={modalHide}>
            Ok
          </Button>
        </div>
      </div>
    )
  }
});

export default Component
