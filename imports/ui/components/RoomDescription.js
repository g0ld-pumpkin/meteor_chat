import React from 'react';
import { Meteor } from 'meteor/meteor';

import CreateRoom from '../modals/CreateRoom.js';

import './RoomDescription.css';

export default class RoomDescription extends React.Component {
  constructor(props) {
    super(props);

    this.descriptionRef = React.createRef();
    this.pinnedContainerRef = React.createRef();
    this.createRoomRef = React.createRef();

    this.displayPinnedMessage = this.displayPinnedMessage.bind(this);
    this.showDescription = this.showDescription.bind(this);
    this.editRoom = this.editRoom.bind(this);
  }

  createPinnedMessageEntry(message) {
    return (
      <div className='pinnedMessage' key={message._id}>
        <div>
          <span className='chatLineDate'>[{message.character.createdAt.toLocaleTimeString()}]</span>
          <span className="chatLineCharNickname"> {message.character.nickname} : </span>
        </div>
        <div style={{color: message.character.textColor}} dangerouslySetInnerHTML={{__html: message.text}}></div>
      </div>
    );
  }

  displayPinnedMessage() {
    if (this.pinnedContainerRef.current.style.display === 'inline-block') {
      this.pinnedContainerRef.current.style.display = 'none';
    } else {
      this.pinnedContainerRef.current.style.display = 'inline-block';
    }
  }

  showDescription() {
    if (this.descriptionRef.current.style.height === 'auto') {
      this.descriptionRef.current.style.height = '36px';
    } else {
      this.descriptionRef.current.style.height = 'auto';
    }
  }

  editRoom() {
    this.createRoomRef.current.show();
  }

  render() {
    return (
      <div className="roomDescription">
        <CreateRoom ref={this.createRoomRef} user={this.props.user} create={false} room={this.props.room} />
        <h1 style={{display: 'inline-block', verticalAlign: 'top'}}>{this.props.room.name}</h1>
        <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '10px', paddingTop: '10px'}}>
          {this.props.user && this.props.user.profile.selectedCharacter && (this.props.user.profile.selectedCharacter.sysOp || this.props.user.profile.selectedCharacter._id === this.props.room.creator) &&
            <i className="fas fa-pencil-alt pencilIcon" style={{marginLeft: '10px', color: '#919191'}} onClick={this.editRoom}></i>
          }
          <i className="fas fa-thumbtack thumbtackIcon" style={{marginLeft: '40px', color: '#919191'}} onClick={this.displayPinnedMessage}></i>
        </div>
        <div className="pinnedContainer" ref={this.pinnedContainerRef}>
          <div className="pinnedTitleBox">
            <h4>Pinned Messages</h4>
          </div>
          {this.props.pinnedMessages.map(pinnedMessage => this.createPinnedMessageEntry(pinnedMessage))}
          <hr />
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', paddingTop: '10px'}}>
          <i className="fas fa-minus showDescriptionIcon" style={{color: '#919191'}} onClick={this.showDescription}></i>
        </div>
        <p style={{background: 'black'}} ref={this.descriptionRef}>{this.props.room.description}</p>
      </div>
    );
  }
}
