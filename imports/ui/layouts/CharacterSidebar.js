import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/Rooms.js';

import CharacterSidebarList from '../components/CharacterSidebarList.js';
import SelectCharacter from '../components/SelectCharacter.js';
import RoomList from '../components/RoomList.js';
import CharacterManagment from '../components/CharacterManagment.js';

import './CharacterSidebar.css';

class CharacterSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.logInCharacterRef = React.createRef();
    this.selectCharacterRef = React.createRef();
    this.selectRoomRef = React.createRef();

    this.selectedRoom = null;

    this.manageCharacters = this.manageCharacters.bind(this);
    this.logInCharacter = this.logInCharacter.bind(this);
    this.enterChat = this.enterChat.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
    this.hide = this.hide.bind(this);
  }

  manageCharacters() {
    if (document.getElementById('characterManagment').style.display === 'block') {
      document.getElementById('characterManagment').style.display = 'none';
    } else {
      document.getElementById('characterManagment').style.display = 'block';
    }
  }

  logInCharacter() {
    if (this.logInCharacterRef.current.style.display === 'block') {
      this.logInCharacterRef.current.style.display = 'none';
    } else {
      this.logInCharacterRef.current.style.display = 'block';
    }
  }

  enterChat() {
    let selectedCharacter = this.selectCharacterRef.current.getSelectedCharacter();
    if (selectedCharacter === null) {
      return;
    }
    if (this.selectedRoom === null) {
      Meteor.call('account.logInCharacter', selectedCharacter, this.props.crossroads);
      Meteor.call('rooms.enter', this.props.crossroads);
    } else {
      Meteor.call('account.logInCharacter', selectedCharacter, this.selectedRoom);
      Meteor.call('rooms.enter', this.selectedRoom);
    }
    this.logInCharacter();
    this.selectCharacterRef.current.reset();
  }

  selectRoom(room) {
    this.selectedRoom = room;
  }

  hide() {
    this.props.hideCharacterSidebar();
  }

  render() {
    return (
      <div id="characterSidebar">
        <i className="fas fa-minus hideCharacterManagmentIcon" style={{color: '#919191'}} onClick={this.hide}></i>
        <div style={{marginBottom: '20px'}}></div>
        <div id="characterSidebarHeader">
          <div id="characterSidebarUsername">
            <span style={{color: '#919191'}}>{this.props.user && this.props.user.username}</span><br />
            <span style={{color: '#3f3f3f', fontSize: '11px'}}>Character Management</span>
          </div>
          <i className="fas fa-users-cog fa-lg" id="characterManagmentIcon" onClick={this.manageCharacters}></i>
        </div>
        <hr />
        {this.props.user && <CharacterManagment numberOfCharacters={this.props.numberOfCharacters} characters={this.props.user.profile.characters} />}
        {this.props.user && <CharacterSidebarList numberOfCharacters={this.props.numberOfCharacters} characters={this.props.user.profile.characters.filter(character => character.loggedIn)} selectedCharacter={this.props.user.profile.selectedCharacter} />}
        <button onClick={this.logInCharacter} className="flatBlueButton" style={{width: '150px', display: 'block', margin: '20px auto'}}>LOG IN CHARACTER</button>
        <div id="logInCharacter" ref={this.logInCharacterRef}>
          <div className="logInLabel">Character</div>
          <SelectCharacter ref={this.selectCharacterRef} characters={this.props.user && this.props.user.profile.characters.filter(character => !character.loggedIn)} />
          <div className="logInLabel">Room</div>
          <RoomList ref={this.selectRoomRef} selectRoom={this.selectRoom} join={false} />
          <div style={{marginBottom: '20px'}}></div>
          <button style={{width: '210px'}} onClick={this.enterChat} className="flatBlueButton">ENTER CHAT</button>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('account.all');
  Meteor.subscribe('rooms.list');

  return {
    crossroads: Rooms.find().fetch().filter(room => room.name === 'CROSSROADS')[0],
    user: Meteor.user(),
    numberOfCharacters: _.reduce(Meteor.users.find({}).map(account => account.profile.characters.length), function (memo, num) { return memo + num; }, 0),
  };
})(CharacterSidebar);
