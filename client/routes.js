import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import App from '../imports/ui/pages/App.js';
import PrivateTab from '../imports/ui/pages/PrivateTab.js';
import Profile from '../imports/ui/pages/Profile.js';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/admin" component={App} />
      <Route exact path='/admin/accounts' component={App} />
      <Route exact path="/admin/accounts/:accountName" component={App} />
      <Route exact path='/admin/characters' component={App} />
      <Route exact path="/admin/characters/:characterName" component={App} />
      <Route exact path="/admin/backup" component={App} />
      <Route exact path="/admin/backup/:accountNameBackup" component={App} />
      <Route exact path="/admin/blacklist" component={App} />
      <Route exact path="/admin/monitor" component={App} />
      <Route exact path="/admin/dump" component={App} />
      <Route exact path="/p/:characterName" component={App} />
      <Route exact path="/c/:characterName" component={Profile} />
    </Switch>
  </Router>
);
