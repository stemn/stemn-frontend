import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import AppAuthed            from './AppAuthed';
import AppRoot              from './AppRoot';
import AppUnAuthed          from './AppUnAuthed';
import Home                 from './Home';
import LoginView            from './Login';
import NotFoundView         from 'pages/NotFound';
import ProjectOverviewView  from './ProjectOverview'
import ProjectView          from './Project'
import Register             from './Register';
import Settings             from './Settings';
import SettingsAccount      from './SettingsAccount';
import SettingsBilling      from './SettingsBilling';
import SettingsEmails       from './SettingsEmails';
import SettingsProfile      from './SettingsProfile';
import SettingsProjects     from './SettingsProjects';
import User                 from './User';

export default (
  <Route                                       component={AppRoot}>
   
    <Route                                     component={AppAuthed}>
      <Route path="settings"                   component={Settings}>
        <IndexRoute                            component={SettingsProfile}/>
        <Route path="account"                  component={SettingsAccount}/>
        <Route path="billing"                  component={SettingsBilling}/>
        <Route path="emails"                   component={SettingsEmails}/>
        <Route path="projects"                 component={SettingsProjects}/>
      </Route>    
    </Route>   
       
    <Route                                     component={AppUnAuthed}>
      <Route path="login"                      component={LoginView} />
      <Route path="register"                   component={Register} />
    </Route>  
        
    <Route path="/"                            component={Home} />
    <Route path="project/:stub"                component={ProjectView}>
      <IndexRoute                              component={ProjectOverviewView} />
    </Route>
    <Route path="404"                          component={NotFoundView} />
    <Route path="users/:stub"                  component={User} />
    <Redirect from="*"                         to="404" />
  </Route>
);
