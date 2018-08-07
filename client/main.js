import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './routes.js';

import App from '../imports/ui/pages/App.js';
import PrivateTab from '../imports/ui/pages/PrivateTab.js';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
