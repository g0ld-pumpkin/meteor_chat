import React from 'react';
import { Meteor } from 'meteor/meteor';

import PrivateMessageList from '../components/PrivateMessageList.js';
import ChannelList from '../components/ChannelList.js';
import Chat from '../components/Chat.js';
import ChatEdit from '../components/ChatEdit.js';
import Login from '../components/Login.js';

import './ChatSection.css';

export default class ChatSection extends React.Component {
  constructor(props) {
    super(props);

    this.chatEditRef = React.createRef();
    this.privateMessageListRef = React.createRef();

    this.getChatEditRef = this.getChatEditRef.bind(this);
    this.filterMessage = this.filterMessage.bind(this);

    console.log(this.props.user);
  }

  getChatEditRef() {
    return this.chatEditRef.current;
  }

  getPrivateMessageListRef() {
    return this.privateMessageListRef.current;
  }

  componentWillUpdate(nextProps) {
    if (!this.props.user || !this.props.user.profile.selectedCharacter || !nextProps.user.profile.selectedCharacter) {
      return;
    }

    if (nextProps.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Mention').length > this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Mention').length && this.props.user.profile.settings.tagsYou && !this.props.user.profile.settings.muteAllSounds) {
      this.playUserTagsYouSound();
    }
    if (nextProps.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private').length > this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private').length && this.props.user.profile.settings.sendsYouPersonalMessage && !this.props.user.profile.settings.muteAllSounds) {
      this.playUserSendsPersonalMessageSound();
    }
  }

  filterMessage(message) {
    if (this.props.monitor) {
      return message.channel === this.props.user.profile.selectedCharacter.channel;
    } else {
      return ((message.channel === 'all' || message.channel === this.props.user.profile.selectedCharacter.channel) && message.type !== 'Whisper');
    }
  }

  playUserTagsYouSound() {
    let tagSound = new Audio('/sounds/to-the-point.ogg');
    tagSound.play();
  }

  playUserSendsPersonalMessageSound() {
    let personalMessageSound = new Audio('/sounds/to-the-point.ogg');
    personalMessageSound.play();
  }

  render() {
    return (
      <div id="chatSection">
        {this.props.activeRoom && this.props.activeRoom.channels.length > 0 && this.props.user &&
          <ChannelList channels={this.props.activeRoom.channels} user={this.props.user} />
        }
        {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.privateMessages && this.props.user.profile.selectedCharacter.privateMessages.length > 0 &&
          <PrivateMessageList user={this.props.user} mentions={this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private')} privateMessages={this.props.user.profile.selectedCharacter.privateMessages} outerList={true} ref={this.privateMessageListRef} />
        }

        {this.props.activeRoom && this.props.user && this.props.user.profile.selectedCharacter &&
          <Chat emptyHeader={this.props.activeRoom.channels.length === 0 && this.props.user.profile.selectedCharacter.privateMessages.length === 0} 
          private={false} user={this.props.user} mentions={this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Mention')} messages={this.props.activeRoom.messages.filter(message => this.filterMessage(message))} />
        }

        {(this.props.user === null || (this.props.user && !this.props.user.profile.selectedCharacter)) && 
        this.props.activeRoom && 

        <Chat emptyHeader={this.props.activeRoom.channels.length === 0 && this.props.user === 0} 
        // <Chat emptyHeader={this.props.activeRoom.channels.length === 0 && this.props.user.profile.selectedCharacter.privateMessages.length === 0} 
        private={false} mentions={[]} messages={this.props.activeRoom.messages.filter(message => message.channel === 'default')} />
        }

        {!this.props.userId &&
          <Login />
        }

        {this.props.user && this.props.user.profile.selectedCharacter &&
          <ChatEdit private={false} ref={this.chatEditRef} room={this.props.activeRoom} character={this.props.user.profile.selectedCharacter} user={this.props.user} />
        }
      </div>
    );
  }
}
