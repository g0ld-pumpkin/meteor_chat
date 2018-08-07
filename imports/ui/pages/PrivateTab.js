import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import PrivateMessage from '../components/PrivateMessage.js';

export default class PrivateTab extends React.Component {
  constructor(props) {
    super(props);

    this.privateMessageRef = React.createRef();
  }

  componentWillUpdate(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <div>
        {this.props.user && this.props.user.profile.selectedCharacter &&
          <PrivateMessage browserTab={true} user={this.props.user} mentions={this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private')} privateMessages={this.props.user.profile.selectedCharacter.privateMessages} ref={this.privateMessageRef} />
        }
      </div>
    );
  }
}
