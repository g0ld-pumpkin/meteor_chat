import React from 'react';
import { Meteor } from 'meteor/meteor';

import './ChatSettings.css';

export default class ChatSettings extends React.Component {
  constructor(props) {
    super(props);

    this.chatSettingsRef = React.createRef();

    this.show = this.show.bind(this);
    this.applySettings = this.applySettings.bind(this);
    this.fillSettings = this.fillSettings.bind(this);
  }

  componentDidMount() {
    this.fillSettings();
  }

  componentDidUpdate() {
    this.fillSettings();
  }

  fillSettings() {
    if (!this.props.user || !this.props.user.profile.settings) {
      return;
    }
    this.disableEmojis.checked = this.props.user.profile.settings.disableEmojis;
    this.showTimestamps.checked = this.props.user.profile.settings.timestamps;
    this.joinsActiveRoom.checked = this.props.user.profile.settings.joinsActiveRoom;
    this.sendsMessageActiveRoom.checked = this.props.user.profile.settings.sendsMessageInActiveRoom;
    this.tagsYou.checked = this.props.user.profile.settings.tagsYou;
    this.sendsYouPersonalMessage.checked = this.props.user.profile.settings.sendsYouPersonalMessage;
    this.muteAllSounds.checked = this.props.user.profile.settings.muteAllSounds;
  }

  show() {
    if (this.chatSettingsRef.current.style.display === 'block') {
      this.chatSettingsRef.current.style.display = 'none';
    } else {
      this.chatSettingsRef.current.style.display = 'block';
    }
  }

  applySettings(event) {
    event.preventDefault();
    let settings = {
      timestamps: this.showTimestamps.checked,
      joinsActiveRoom: this.joinsActiveRoom.checked,
      sendsMessageInActiveRoom: this.sendsMessageActiveRoom.checked,
      tagsYou: this.tagsYou.checked,
      sendsYouPersonalMessage: this.sendsYouPersonalMessage.checked,
      muteAllSounds: this.muteAllSounds.checked,
      disableEmojis: this.disableEmojis.checked,
      theme: 'rpnight',
    };
    Meteor.call('account.applySettings', settings);
    this.show();
  }

  render() {
    return (
      <div className="chatSettings" ref={this.chatSettingsRef}>
        <div className="chatSettingsHeaderBox">
          <span>CHAT SETTINGS</span>
        </div>
        <div className="formBox">
          <form style={{marginLeft: '15px'}}>
            <label htmlFor='theme'>Theme</label><input type='text' className='formInput' placeholder='RPN night' style={{height: '35px'}} disabled /><br /><br />
            <input type="checkbox" ref={(input) => this.disableEmojis = input} />Disable Emoji<br /><br />
            <input type="checkbox" ref={(input) => this.showTimestamps = input} />Show Timestamps<br /><br />
          </form>
        </div>
        <hr />
        <div className="chatSettingsTitleBox">
          <h4>SOUND NOTIFICATIONS</h4>
        </div>
        <hr />
        <div className="formBox">
          <div style={{marginBottom: '15px'}}></div>
          <form style={{marginLeft: '15px', marginRight: '15px'}}>
            <input type="checkbox" ref={(input) => this.joinsActiveRoom = input} />When user joins active room<br /><br />
            <input type="checkbox" ref={(input) => this.sendsMessageActiveRoom = input} />When user sends message in active room<br /><br />
            <input type="checkbox" ref={(input) => this.tagsYou = input} />When user tags you<br /><br />
            <input type="checkbox" ref={(input) => this.sendsYouPersonalMessage = input} />When user sends you a personal message<br /><br />
            <input type="checkbox" ref={(input) => this.muteAllSounds = input} />Mute all sounds<br />
            <p style={{color: 'red'}}>Note: Adjusting preferences here applies changes to all characters</p>
            <button onClick={this.applySettings} className="flatBlueButton" style={{marginLeft: '10px', width: '200px'}}>APPLY CHANGES</button>
          </form>
        </div>
        <div style={{marginBottom: '30px'}}></div>
      </div>
    );
  }
}
