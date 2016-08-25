// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SettingsActions from 'app/shared/actions/settings';
import * as UsersActions from 'app/shared/actions/users';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Field } from 'react-redux-form';
import { Link } from 'react-router';
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import SelectList from 'app/renderer/main/components/Input/SelectList/SelectList'
import Header from 'app/renderer/main/modules/Header/Header.jsx'
import Upload from 'app/renderer/main/modules/Upload/Upload.jsx'
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.UsersActions.getUser({userId: this.props.auth.user._id});
  },
  render() {
    const { entityModel, user } = this.props;
    console.log(this.props);

    return (

      <div className="layout-column flex">
        <Header>Settings</Header>

        <Tabs size="lg">
          <Link activeClassName="active" to="/settings/account">Account</Link>
          <Link activeClassName="active" to="/settings/application">Application</Link>
        </Tabs>

        <div className={classes.container+' layout-row layout-align-center flex'}>
          <div style={{width: '600px'}}>

            <div className={classes.panel}>
              <h3>Name and blurb</h3>
              <p>Set your name, blurb and picture.</p>
              <Upload uploadId="UserSettingsAvatar"></Upload>
              <br />

              <div className="layout-row">
                <Field model={`${entityModel}.profile.firstname`}>
                  <input className="dr-input" type="text" placeholder="First Name" style={{marginRight: '7px'}}/>
                </Field>
                <Field model={`${entityModel}.profile.lastname`}>
                  <input className="dr-input" type="text" placeholder="Last Name" style={{marginLeft: '7px'}}/>
                </Field>
              </div>
              <br />
              <Field model={`${entityModel}.profile.blurb`}>
                <input className="dr-input" type="text" placeholder="Blurb"/>
              </Field>
              <br />
              <div className="layout-row layout-align-end">
                <Button className="primary" onClick={()=>this.linkRemote()}>Update basic info</Button>
              </div>
            </div>

            <div className={classes.panel}>
              <h3>Team Members</h3>
            </div>
            <div className={classes.panel}>
              <h3>Project Type</h3>

            </div>
          </div>
         </div>
      </div>
    );

  }
});


//    return (
//      <div className="layout-column flex">
//
//        <div className="layout-column flex rel-box" style={{padding: '5px 25px'}}>
//          <div className="layout-row flex">
//            <div className="flex-50">
//              <br/>
//              <h3>Appearance</h3>
//              <SelectList value="dark">
//                <div value="light">Light</div>
//                <div value="dark">Dark</div>
//              </SelectList>
//              <h3>Privacy</h3>
//              <div>Help us improve by sending anonymous usage data</div>
//              <Toggle model="settings.privacy" value={this.props.settings.privacy} />
//
//              <br />
//

//            </div>
//          </div>
//        </div>
//      </div>
//    );


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({settings, auth, users}, {params}) {
  return {
    settings,
    auth,
    user: users[auth.user._id],
    entityModel: `users.${auth.user._id}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    SettingsActions: bindActionCreators(SettingsActions, dispatch),
    UsersActions: bindActionCreators(UsersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

