import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ChatContext } from '../pages/App.js';

import './ChatLine.css';

import ChatAvatar from './ChatAvatar.js';

export default class ChatLine extends React.Component {
  constructor(props) {
    super(props);

    this.hoverMenuIconRef = React.createRef();
    this.hoverMenuRef = React.createRef();
    this.postRef = React.createRef();

    this.displayHoverActionMenu = this.displayHoverActionMenu.bind(this);
  }

  editPost() {
    this.postRef.current.className = 'chatLineEdit';
    this.postRef.current.firstChild.contentEditable = true;
    this.postRef.current.firstChild.focus();
  }

  savePost(room, event) {
    if (event.key == 'Enter') {
      this.postRef.current.className = '';
      this.postRef.current.firstChild.contentEditable = false;
      Meteor.call('rooms.updateMessage', room, this.props.message._id, this.postRef.current.innerHTML);
      this.displayHoverActionMenu();
    }
  }

  deletePost(room) {
    Meteor.call('rooms.deleteMessage', room, this.props.message);
    this.displayHoverActionMenu();
  }

  pinPost(room, pin) {
    Meteor.call('rooms.pinMessage', room, this.props.message._id, pin);
    this.displayHoverActionMenu();
  }

  displayHoverActionMenuIcon(user, activeRoom) {
    if (this.props.selectedMessage !== null || this.props.private) {
      return;
    }
    if (!user || !user.profile.selectedCharacter || !this.props.message.character) {
      return;
    }
    if (!user.profile.selectedCharacter.sysOp && user.profile.selectedCharacter._id !== activeRoom.creator && !this.allowDelete(user, activeRoom) && user.profile.selectedCharacter._id !== this.props.message.character._id) {
      return;
    }
    this.hoverMenuIconRef.current.style.display = 'inline-block';
  }

  hideHoverActionMenuIcon(user) {
    if (this.props.selectedMessage !== null && this.props.selectedMessage._id === this.props.message._id) {
      return;
    }
    if (!user || !user.profile.selectedCharacter) {
      return;
    }
    this.hoverMenuIconRef.current.style.display = 'none';
  }

  displayHoverActionMenu() {
    if (this.hoverMenuRef.current.style.display === 'block') {
      this.hoverMenuRef.current.style.display = 'none';
      this.props.clearSelectedMessage();
    } else {
      this.hoverMenuRef.current.style.display = 'block';
      this.props.selectMessage(this.props.message);
    }
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

  allowDelete(user, activeRoom) {
    if (!this.props.message.character) {
      return false;
    }
    if (user.profile.selectedCharacter.sysOp || user.profile.selectedCharacter._id === this.props.message.character._id) {
      return true;
    }
    if (user.profile.selectedCharacter.admin && !this.props.message.character.sysOp) {
      return true;
    }
    if (user.profile.selectedCharacter.globalModerator && !this.props.message.character.admin && !this.props.message.character.sysOp) {
      return true;
    }
    if (this.isRoomModerator(user, activeRoom)  && !this.props.message.character.globalModerator && !this.props.message.character.admin && !this.props.message.character.sysOp) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({user, activeRoom}) => (
          <div className="chatLine" messageid={this.props.message._id} onMouseEnter={this.displayHoverActionMenuIcon.bind(this, user, activeRoom)} onMouseLeave={this.hideHoverActionMenuIcon.bind(this, user)}>
            <div className="chatLineTextContainer">
              {user && user.profile.settings.timestamps &&
                <span className="chatLineDate">{this.props.message.createdAt.toLocaleTimeString('en-US', { hour12: false })} </span>
              }
              {this.props.message.type === 'Regular' && this.props.message.withBrackets &&
                <span className="chatLineCharNickname">[{this.props.message.character.nickname}] </span>
              }
              {this.props.message.type === 'Regular' && !this.props.message.withBrackets &&
                <span className="chatLineCharNickname">{this.props.message.character.nickname} </span>
              }
              {this.props.message.type === 'Regular' && this.props.message.character &&
                <span ref={this.postRef} style={{marginRight: '0px', color: this.props.message.character.textColor}} dangerouslySetInnerHTML={{__html: this.props.message.text}} onKeyPress={this.savePost.bind(this, activeRoom)}></span>
              }
              {this.props.message.type === 'Whisper' &&
                <>
                  <span className="chatLineCharNickname">[<b>{this.props.message.character}</b> whispers to {this.props.message.toCharacter}] </span>
                  <span ref={this.postRef} style={{marginRight: '0px', color: this.props.message.color}} dangerouslySetInnerHTML={{__html: this.props.message.text}}></span>
                </>
              }
              {!this.props.message.character &&
                <span ref={this.postRef} style={{marginRight: '0px'}} dangerouslySetInnerHTML={{__html: this.props.message.text}} onKeyPress={this.savePost.bind(this, activeRoom)}></span>
              }
              {this.props.message.type === 'Private' && this.props.message.withBrackets &&
                <span className="chatLineCharNickname">[{this.props.message.character}] </span>
              }
              {this.props.message.type === 'Private' && !this.props.message.withBrackets &&
                <span className="chatLineCharNickname">{this.props.message.character} </span>
              }
              {this.props.message.type === 'Private' &&
                <span ref={this.postRef} style={{marginRight: '0px', color: this.props.message.color}} dangerouslySetInnerHTML={{__html: this.props.message.text}} onKeyPress={this.savePost.bind(this, activeRoom)}></span>
              }
            </div>
            {(user && user.profile.selectedCharacter) &&
              <>
                <div className="hoverActionContainer">
                  <i className="fas fa-ellipsis-v hoverActionIcon" style={{color: 'white'}} ref={this.hoverMenuIconRef} onClick={this.displayHoverActionMenu}></i>
                  <div className="hoverActionMenu" ref={this.hoverMenuRef}>
                    {(!this.props.message.pinned && (user.profile.selectedCharacter.sysOp || user.profile.selectedCharacter._id === activeRoom.creator)) &&
                      <div className="hoverAction" onClick={this.pinPost.bind(this, activeRoom, true)}>Pin</div>
                    }
                    {(this.props.message.pinned && (user.profile.selectedCharacter.sysOp || user.profile.selectedCharacter._id === activeRoom.creator)) &&
                      <div className="hoverAction" onClick={this.pinPost.bind(this, activeRoom, false)}>Unpin</div>
                    }
                    {user.profile.selectedCharacter && this.props.message.character && user.profile.selectedCharacter._id === this.props.message.character._id &&
                      <div className="hoverAction" onClick={this.editPost.bind(this)}>Edit</div>
                    }
                    {this.allowDelete(user, activeRoom) &&
                     <div className="hoverAction" onClick={this.deletePost.bind(this, activeRoom)}>Delete</div>
                    }
                  </div>
                </div>
              </>
            }
          </div>
        )}
      </ChatContext.Consumer>
    );
  }
}
