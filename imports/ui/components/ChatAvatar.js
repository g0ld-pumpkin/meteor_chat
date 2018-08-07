import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ChatContext } from '../pages/App.js';
import { MentionUserContext } from '../layouts/MiddleSection.js';

import './ChatAvatar.css';

export default class SearchSidebarAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.avatarStatusMenuRef = React.createRef();

    this.setStatus = this.setStatus.bind(this);
    this.logout = this.logout.bind(this);
    this.ignore = this.ignore.bind(this);
    this.unignore = this.unignore.bind(this);
    this.isIgnored = this.isIgnored.bind(this);
    this.inActiveRoom = this.inActiveRoom.bind(this);
    this.isSelectedCharacter = this.isSelectedCharacter.bind(this);
    this.hasHigherClearance = this.hasHigherClearance.bind(this);
  }

  displayStatusMenu() {
    if (this.avatarStatusMenuRef.current.style.display === 'block') {
      this.avatarStatusMenuRef.current.style.display = 'none';
    } else {
      this.avatarStatusMenuRef.current.style.display = 'block';
    }
  }

  setStatus(status) {
    Meteor.call('account.setCharacterStatus', this.props.character, status);
  }

  logout() {
    Meteor.call('account.logOutCharacter', this.props.character);
  }

  privateMessage(showPrivateMessageTab) {
    Meteor.call('account.createPrivateMessage', this.props.character.nickname);
    showPrivateMessageTab(this.props.character.nickname);
  }

  mention(mentionUser, user) {
    mentionUser(user);
  }

  ignore() {
    Meteor.call('account.ignoreCharacter', this.props.character);
  }

  unignore() {
    Meteor.call('account.unignoreCharacter', this.props.character);
  }

  kick(activeRoom) {
    Meteor.call('rooms.kickUser', activeRoom, this.props.character);
  }

  ban(activeRoom) {
    Meteor.call('rooms.banUser', activeRoom, this.props.character);
  }

  isRoomModerator(user, activeRoom) {
    let moderator = false;
    activeRoom.moderators.forEach((character) => {
      if (character._id === user.profile.selectedCharacter._id) {
        moderator = true;
      }
    });
    return moderator;
  }

  isRoomCreator(user, activeRoom) {
    return activeRoom.creator === user.profile.selectedCharacter._id;
  }

  isIgnored(user) {
    if (!user.profile.selectedCharacter.ignoreList) {
      return false;
    }
    let isIgnored = false;
    user.profile.selectedCharacter.ignoreList.forEach((ignored) => {
      if (ignored === this.props.character._id) {
        isIgnored = true;
      }
    })
    return isIgnored;
  }

  inActiveRoom(activeRoom) {
    let inActive = false;
    activeRoom.characters.forEach(character => {
      if (character.nickname === this.props.character.nickname) {
        inActive = true;
      }
    });
    return inActive;
  }

  isSelectedCharacter(user) {
    if (!user || !user.profile.selectedCharacter) {
      return false;
    }
    return user.profile.selectedCharacter._id === this.props.character._id;
  }

  hasHigherClearance(user) {
    if (this.props.character.sysOp) {
      return true;
    }
    if (user.profile.selectedCharacter.admin && this.props.character.admin) {
      return true;
    }
    if (user.profile.selectedCharacter.globalModerator && (this.props.character.globalModerator || this.props.character.admin || this.props.character.sysOp)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({user, activeRoom}) => (
          <MentionUserContext.Consumer>
            {({mentionUser, showPrivateMessageTab}) => (
              <div className="avatar" style={{verticalAlign: 'top'}} onClick={this.displayStatusMenu.bind(this)}>
                {this.props.character.gender === 'Neutral' && <img src="/icons/neutralicon.png" width='32' height='32' /> }
                {this.props.character.gender === 'Male' && <img src="/icons/maleicon.png" width='32' height='32' /> }
                {this.props.character.gender === 'Female' && <img src="/icons/femaleicon.png" width='32' height='32' /> }
                <div className="chatAvatarMenu" ref={this.avatarStatusMenuRef}>
                  <a href={`/c/${this.props.character.nickname}`} target='_blank' style={{ color: 'inherit', textDecoration: 'none'}}><div className="chatAvatarMenuItem">View {this.props.character.nickname} Profile</div></a>
                  {user && user.profile.selectedCharacter && !this.isSelectedCharacter(user) &&
                    <>
                      <div className="chatAvatarMenuItem" onClick={this.privateMessage.bind(this, showPrivateMessageTab)}>Private Message {this.props.character.nickname}</div>
                      {(!this.props.searchResult || this.inActiveRoom(activeRoom)) &&
                        <div className="chatAvatarMenuItem" onClick={this.mention.bind(this, mentionUser, this.props.character.nickname)}>@Mention {this.props.character.nickname}</div>
                      }
                      {!this.isIgnored(user) && <div className="chatAvatarMenuItem" onClick={this.ignore}>Ignore {this.props.character.nickname}</div>}
                      {this.isIgnored(user) && <div className="chatAvatarMenuItem" onClick={this.unignore}>Unignore {this.props.character.nickname}</div>}
                      {!this.props.searchResult && (this.isRoomModerator(user, activeRoom) || this.isRoomCreator(user, activeRoom) || user.profile.selectedCharacter.sysOp || user.profile.selectedCharacter.admin || user.profile.selectedCharacter.globalModerator) && !this.hasHigherClearance(user) &&
                        <>
                          <div className="chatAvatarMenuItem" onClick={this.kick.bind(this, activeRoom)}>Kick {this.props.character.nickname}</div>
                          <div className="chatAvatarMenuItem" onClick={this.ban.bind(this, activeRoom)}>Ban {this.props.character.nickname}</div>
                        </>
                      }
                    </>
                  }
                </div>
              </div>
            )}
          </MentionUserContext.Consumer>
        )}
      </ChatContext.Consumer>
    );
  }
}
