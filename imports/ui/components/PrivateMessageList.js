import React from 'react';
import { Meteor } from 'meteor/meteor';

import PrivateMessage from './PrivateMessage.js';

import './PrivateMessageList.css';

export default class PrivateMessageList extends React.Component {
  constructor(props) {
    super(props);

    this.privateMessageChatRef = React.createRef();

    this.notificationCount = this.notificationCount.bind(this);
    this.computeCssClass = this.computeCssClass.bind(this);
  }

  showPrivateMessages(characterName) {
    if (this.props.outerList) {
      this.privateMessageChatRef.current.show(characterName);
    } else {
      this.props.openTab(characterName);
    }
  }

  deletePrivateMessages(characterName, event) {
    event.stopPropagation();
    Meteor.call('account.deletePrivateMessage', characterName);
  }

  notificationCount(privateMessage) {
    if (!this.props.user) {
      return 0;
    }
    let notif = this.props.user.profile.selectedCharacter.notifications.filter(notif => {
      return (notif.type === 'Private' && notif.from === privateMessage.name);
    });
    return notif.length;
  }

  computeCssClass(privateMessage) {
    if (this.props.outerList) {
      return 'privateMessage privateMessageButton selectedPrivateMessage';
    } else {
      return privateMessage.name === this.props.selectedTab ? 'privateMessage privateMessageButton selectedPrivateMessage' : 'privateMessage flatBlueButton privateMessageButton';
    }
  }

  createPrivateMessageEntry(privateMessage) {
    return (
      <div className={this.computeCssClass(privateMessage)} key={privateMessage._id} onClick={this.showPrivateMessages.bind(this, privateMessage.name)}>
        {privateMessage.name}
        {this.notificationCount(privateMessage) > 0 &&
          <span className="privateNotifications">{this.notificationCount(privateMessage)}</span>
        }
        <span className="deletePrivateMessage" onClick={this.deletePrivateMessages.bind(this, privateMessage.name)}>&times;</span>
      </div>
    );
  }

  getPrivateMessageChatRef() {
    return this.privateMessageChatRef.current;
  }

  render() {
    return (
      <div className="privateMessages">
        {this.props.privateMessages &&
          this.props.privateMessages.map((privateMessage) => this.createPrivateMessageEntry(privateMessage))
        }
        {this.props.outerList &&
          <PrivateMessage user={this.props.user} mentions={this.props.user.profile.selectedCharacter.notifications.filter(notif => notif.type === 'Private')} privateMessages={this.props.privateMessages} ref={this.privateMessageChatRef} />
        }
      </div>
    );
  }
}
