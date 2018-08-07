import React from 'react';
import { Meteor } from 'meteor/meteor';

import PrivateMessageList from './PrivateMessageList.js';
import Chat from './Chat.js';
import ChatInput from './ChatInput.js';

import './PrivateMessage.css';

export default class PrivateMessage extends React.Component {
  constructor(props) {
    super(props);

    this.privateMessageChatRef = React.createRef();

    this.state = {
      selectedTab: '',
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.openTab = this.openTab.bind(this);
    this.messages = this.messages.bind(this);

    console.log(this.props);
  }

  componentDidMount() {
    if (this.props.browserTab) {
      this.show();
    }
  }

  openTab(characterName) {
    this.setState({
      selectedTab: characterName,
    });
  }

  show(characterName) {
    this.privateMessageChatRef.current.style.display = 'block';
    if (characterName) {
      this.setState({
        selectedTab: characterName,
      });
    }
  }

  hide() {
    this.privateMessageChatRef.current.style.display = 'none';
  }

  messages(privateMessages) {
    if (this.state.selectedTab === '') {
      return [];
    }
    let privateConversation = this.props.privateMessages.filter(message => message.name === this.state.selectedTab);
    if (privateConversation.length > 0) {
      return privateConversation[0].messages;
    }
    return [];
  }

  render() {
    return (
      <div className='privateMessageChat' ref={this.privateMessageChatRef}>
        {!this.props.browserTab &&
          <>
            <a href={`p/${this.props.user.profile.selectedCharacter.nickname}`} target='_blank'><i className="fas fa-window-maximize fa-lg tabIcon"></i></a>
            <span className="close" onClick={this.hide} style={{top: '0px'}}>&times;</span>
          </>
        }
        <div style={{padding: '10px'}}>
          <PrivateMessageList user={this.props.user} openTab={this.openTab} selectedTab={this.state.selectedTab} privateMessages={this.props.privateMessages} outerList={false} />
        </div>
        <Chat privateMessageChat={this.privateMessageChatRef.current} private={true} user={this.props.user} mentions={this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private')} messages={this.messages()} />
        <div style={{marginBottom: '30px'}}></div>
        <div className='privateChatInputContainer'>
          <ChatInput private={true} user={this.props.user} character={this.props.user.profile.selectedCharacter} selectedTab={this.state.selectedTab} />
        </div>
      </div>
    );
  }
}
