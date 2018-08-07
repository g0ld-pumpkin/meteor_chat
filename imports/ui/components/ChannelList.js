import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import './ChannelList.css';

export default class ChannelList extends React.Component {
  constructor(props) {
    super(props);

  }

  createChannelEntry(channel) {
    if (channel === '') {
      return;
    }
    return (
      <button key={Random.id()} className={this.props.user.profile.selectedCharacter.channel === channel ? 'channel selectedChannel' : 'channel'} onClick={this.selectChannel.bind(this, channel)}>{channel}</button>
    );
  }

  selectChannel(channel) {
    Meteor.call('rooms.channel.select', channel);
  }

  render() {
    return (
      <div className="channels">
        {this.props.channels.map((channel) => this.createChannelEntry(channel))}
      </div>
    );
  }
}
