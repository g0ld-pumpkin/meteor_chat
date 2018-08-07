import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/Accounts.js';
import '../imports/api/Rooms.js';

Accounts.onCreateUser((options, user) => {
  user.profile = options.profile;
  Meteor.call('account.backup', user);
  return user;
});

Accounts.validateLoginAttempt((attempt) => {
  if (!attempt.user) {
    return false;
  }
  if (attempt.user.profile.banned) {
    throw new Meteor.Error('account.login.failed', 'Account banned');
  }
  return true;
});

Meteor.startup(() => {
  console.log('asdfasdfsdfsdfasdfasdfasdfsad');
  Meteor.call('rooms.createCrossroads');
});
