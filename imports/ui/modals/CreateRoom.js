import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import AddCharacters from '../components/AddCharacters.js';

import '../../api/Rooms.js';
import './CreateRoom.css';

export default class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    this.windowRef = React.createRef();
    this.errorMessagesRef = React.createRef();

    this.hide = this.hide.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.lockRoom = this.lockRoom.bind(this);
    this.unlockRoom = this.unlockRoom.bind(this);
    this.fillForm = this.fillForm.bind(this);
  }

  componentDidMount() {
    if (this.props.create) {
      return;
    }
    this.fillForm();
  }

  componentDidUpdate() {
    if (this.props.create) {
      this.reset();
      return;
    }
    this.fillForm();
  }

  fillForm() {
    this.sfw.checked = this.props.room.sfw;
    this.nsfw.checked = !this.props.room.sfw;
    this.public.checked = this.props.room.public;
    this.invisible.checked = !this.props.room.public;
    this.open.checked = !this.props.room.locked;
    this.locked.checked = this.props.room.locked;
    this.roomname.value = this.props.room.name;
    this.password.value = this.props.room.password;
    this.channel1.value = this.props.room.channels.length > 0 ? this.props.room.channels[0] : '';
    this.channel2.value = this.props.room.channels.length > 1 ? this.props.room.channels[1] : '';
    this.preview.value = this.props.room.preview;
    this.description.value = this.props.room.description;
    this.moderators.setCharacters(this.props.room.moderators);
    this.banlist.setCharacters(this.props.room.banlist);
  }

  reset() {
    this.sfw.checked = true;
    this.nsfw.checked = false;
    this.public.checked = true;
    this.invisible.checked = false;
    this.open.checked = true;
    this.locked.checked = false;
    this.roomname.value = '';
    this.password.value = '';
    this.channel1.value = '';
    this.channel2.value = '';
    this.preview.value = '';
    this.description.value = '';
    this.moderators.clear();
    this.banlist.clear();
  }

  hide() {
    this.windowRef.current.style.display = 'none';
  }

  show() {
    this.windowRef.current.style.display = 'block';
  }

  hideMandatoryPassword() {
    document.getElementById('roomPasswordMandatory').style.display = 'none';
  }

  displayMandatoryPassword() {
    document.getElementById('roomPasswordMandatory').style.display = 'inline';
  }

  lockRoom() {
    this.open.disabled = true;
    this.locked.checked = true;
    this.displayMandatoryPassword();
  }

  unlockRoom() {
    this.open.disabled = false;
  }

  createRoom(event) {
    event.preventDefault();
    if (this.roomname.value === '' || this.roomname.value.length > 20) {
      this.errorMessagesRef.current.innerHTML = 'Must enter a roomname (20 characters max)';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    if (this.locked.checked && (this.password.value === '' || this.password.value.length < 4)) {
      this.errorMessagesRef.current.innerHTML = 'Must enter a password of at least 4 characters for locked room';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    if (this.description.value.length > 2000) {
      this.errorMessagesRef.current.innerHTML = 'Room description must be less than 2000 character';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    if (this.channel1.value.length > 20 || this.channel2.value.length > 20) {
      this.errorMessagesRef.current.innerHTML = 'Room channel names can only contain 20 characters';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    let channels = [];
    if (this.channel1.value !== '') {
      channels.push(this.channel1.value);
    }
    if (this.channel2.value !== '') {
      channels.push(this.channel2.value);
    }
    let room = {
      _id: this.props.create ? Random.id() : this.props.room._id,
      name: this.props.create ? this.roomname.value : this.props.room.name,
      sfw: this.sfw.checked,
      public: this.public.checked,
      locked: this.locked.checked,
      password: this.password.value,
      preview: this.preview.value,
      description: this.description.value,
      moderators: this.moderators.getCharacters(),
      banlist: this.banlist.getCharacters(),
      characters: this.props.create ? [] : this.props.room.characters,
      messages: this.props.create ? [] : this.props.room.messages,
      channels: channels,
      creator: this.props.create ? (this.props.user.profile.selectedCharacter ? this.props.user.profile.selectedCharacter._id : null) : this.props.room.creator,
      closed: this.props.create ? false : this.props.room.closed,
    }
    if (this.props.create) {
      Meteor.call('rooms.create', room, (error) => {
        if (error) {
          this.errorMessagesRef.current.innerHTML = error.reason;
          this.errorMessagesRef.current.style.display = 'block';
        } else {
          Meteor.call('rooms.leave', null);
          Meteor.call('rooms.enter', room);
          this.errorMessagesRef.current.innerHTML = '';
          this.errorMessagesRef.current.style.display = 'none';
          this.reset();
          this.hide();
        }
      });
    } else {
      Meteor.call('rooms.update', room);
      this.errorMessagesRef.current.innerHTML = '';
      this.errorMessagesRef.current.style.display = 'none';
      this.reset();
      this.hide();
    }
  }

  render() {
    return (
      <div className="createRoomModal" ref={this.windowRef} className="modal">
        <div className="modalContent" style={{margin: '5% auto'}}>
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>{this.props.create ? 'CREATE A ROOM' : 'EDIT ROOM'}</h4>
            <div className="errorMessages" ref={this.errorMessagesRef}></div>
          </div>
          <hr />
          <div className="formBox">
            <form onSubmit={this.createRoom}>
              <div className="formRow formFlexContainer" style={{justifyContent: 'space-around', paddingRight: '30px'}}>
                <div>
                  <div className="radioGroup">
                    <input type="radio" name="sfw" value="sfw" ref={(input) => this.sfw = input} defaultChecked />SFW
                    <span className="radioButtonRight"><input type="radio" name="sfw" value="nsfw" style={{marginLeft: '30px'}} ref={(input) => this.nsfw = input} />NSFW</span>
                  </div>
                  <div className="radioGroup">
                    <input type="radio" name="public" value="public" ref={(input) => this.public = input} onInput={this.unlockRoom} defaultChecked />Public
                    <span className="radioButtonRight"><input type="radio" name="public" value="invisible" style={{marginLeft: '30px'}} ref={(input) => this.invisible = input} onInput={this.lockRoom} />Invisible</span>
                  </div>
                  <div className="radioGroup">
                    <input type="radio" name="open" value="open" ref={(input) => this.open = input} onInput={this.hideMandatoryPassword} defaultChecked />Open
                    <span className="radioButtonRight"><input type="radio" name="open" value="locked" style={{marginLeft: '30px'}} ref={(input) => this.locked = input} onInput={this.displayMandatoryPassword} />Locked</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="roomname">Room Name</label><input type="text" className="formInput" ref={(input) => this.roomname = input} /><span className="mandatoryFields">*</span><br /><br />
                  <label htmlFor="password">Password</label><input type="text" className="formInput" ref={(input) => this.password = input} /><span className="mandatoryFields roomPassword" id="roomPasswordMandatory">*</span><br /><br />
                  <label htmlFor="channel1">Channel 1</label><input type="text" className="formInput" ref={(input) => this.channel1 = input} /><br /><br />
                  <label htmlFor="channel2">Channel 2</label><input type="text" className="formInput" ref={(input) => this.channel2 = input} />
                </div>
              </div>
              <div style={{marginBottom: '20px'}}></div>
              <div className="formRow">
                <textarea className="formInput" style={{width: '640px', height: '180px', resize: 'none', borderRadius: '4px'}} ref={(textarea) => this.preview = textarea} placeholder="Room Preview"></textarea>
              </div>
              <div className="formRow">
                <textarea className="formInput" style={{width: '640px', height: '180px', resize: 'none', borderRadius: '4px'}} ref={(textarea) => this.description = textarea} placeholder="Room Description"></textarea>
              </div>
              <div className="formRow">
                <span className="addCharactersLabel">Moderators</span><AddCharacters characters={this.props.create ? null : this.props.room.moderators} ref={(moderators) => this.moderators = moderators} />
              </div>
              <div className="formRow">
                <span className="addCharactersLabel">Ban List</span><AddCharacters characters={this.props.create ? null : this.props.room.banlist} ref={(banlist) => this.banlist = banlist} />
              </div>
              <div style={{marginBottom: '20px'}}></div>
              <input type="submit" value={this.props.create ? 'CREATE ROOM' : 'SAVE'} id="signUpButton" className="flatBlueButton" style={{width: '150px', margin: '0'}} />
              <div style={{marginBottom: '20px'}}></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
