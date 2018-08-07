import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import ProfileEdit from '../components/ProfileEdit.js';

import './CreateCharacter.css';

export default class CreateCharacter extends React.Component {
  constructor(props) {
    super(props);

    this.windowRef = React.createRef();
    this.errorMessagesRef = React.createRef();
    this.profileEditRef = React.createRef();

    this.tagRegEx = /^(?:\s*(#\w{1,})((\s+#\w{1,})*)\s*)?$/;
    this.genderTagRegEx = /(#neutral(?:\s*)?|#male(?:\s*)?|#female(?:\s*)?)/gi;

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.createCharacter = this.createCharacter.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate() {
    if (this.props.create) {
      this.reset();
      return;
    }
    if (this.props.character === null) {
      return;
    }
    this.nickname.value = this.props.character.nickname;
    this.personalMessage.value = this.props.character.personalMessage;
    this.sfw.checked = this.props.character.sfw;
    this.nsfw.checked = !this.props.character.sfw;
    this.neutralGender.checked = this.props.character.gender === 'Neutral';
    this.maleGender.checked = this.props.character.gender === 'Male';
    this.femaleGender.checked = this.props.character.gender === 'Female';
    this.defaultProfile.checked = this.props.character.profile.default;
    this.cssProfile.checked = !this.props.character.profile.default;
    this.skype.value = this.props.character.socialMedia.skype;
    this.discord.value = this.props.character.socialMedia.discord;
    this.facebook.value = this.props.character.socialMedia.facebook;
    this.level.value = this.props.character.level;
    this.twitter.value = this.props.character.socialMedia.twitter;
    this.weburl.value = this.props.character.weburl;
    this.tags.value = this.props.character.tags.join(' ');
    this.totalExp.value = this.props.character.totalExp;
    this.pieCount.value = this.props.character.pieCount;
    this.emailInProfile.checked = this.props.character.preferences.emailInProfile;
    this.lastLoginInProfile.checked = this.props.character.preferences.lastLoginInProfile;
    this.accountNameInProfile.checked = this.props.character.preferences.accountNameInProfile;
    this.vipStatusInProfile.checked = this.props.character.preferences.vipStatusInProfile;
    this.pieCountInProfile.checked = this.props.character.preferences.pieCountInProfile;
    this.levelInProfile.checked = this.props.character.preferences.levelInProfile;
    this.applyPreferences.checked = false;
    this.profileEditRef.current.setProfileHTML(this.props.character.profile.html);
  }

  show() {
    this.windowRef.current.style.display = 'block';
  }

  hide(event) {
    if (event) {
      event.preventDefault();
    }
    this.windowRef.current.style.display = 'none';
  }

  reset() {
    this.nickname.value = '';
    this.personalMessage.value = '';
    this.sfw.checked = true;
    this.nsfw.checked = false;
    this.neutralGender.checked = true;
    this.maleGender.checked = false;
    this.femaleGender.checked = false;
    this.defaultProfile.checked = true;
    this.cssProfile.checked = false;
    this.skype.value = '';
    this.discord.value = '';
    this.facebook.value = '';
    this.level.value = '';
    this.twitter.value = '';
    this.weburl.value = '';
    this.tags.value = '';
    this.totalExp.value = '';
    this.pieCount.value = '';
    this.emailInProfile.checked = false;
    this.lastLoginInProfile.checked = false;
    this.accountNameInProfile.checked = false;
    this.vipStatusInProfile.checked = false;
    this.pieCountInProfile.checked = false;
    this.levelInProfile.checked = false;
    this.applyPreferences.checked = false;
    this.profileEditRef.current.clear();
  }

  createCharacter(event) {
    event.preventDefault();
    let nickname = this.nickname.value;
    if (!nickname) {
      this.errorMessagesRef.current.innerHTML = 'You must give a nickname to your character';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    if (this.tagRegEx.test(this.tags.value) !== true) {
      this.errorMessagesRef.current.innerHTML = 'Invalid tags, ex: #anime #detailed #group';
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    let genderTag = this.neutralGender.checked ? "#Neutral" : this.maleGender.checked ? "#Male" : "#Female";
    let tags = [genderTag];
    let enteredTags = this.tags.value.replace(this.genderTagRegEx, '');
    let tagResult = this.tagRegEx.exec(enteredTags);
    if (tagResult[1]) {
      tags = tags.concat(tagResult[0].split(' '));
    }
    tags = tags.filter(tag => tag.length !== 0);
    tags = _.uniq(tags);
    let character = {
      nickname: nickname,
      personalMessage: this.personalMessage.value,
      sfw: this.sfw.checked ? true : false,
      gender: this.neutralGender.checked ? 'Neutral' : this.maleGender.checked ? 'Male' : 'Female',
      profile: {
        default: this.defaultProfile.checked ? true : false,
        html: this.profileEditRef.current.getProfileHTML(),
      },
      avatar: '',
      socialMedia: {
        skype: this.skype.value,
        discord: this.discord.value,
        facebook: this.facebook.value,
        twitter: this.twitter.value,
      },
      level: this.props.create ? 0 : this.level.value,
      weburl: this.weburl.value,
      tags: tags,
      totalExp: this.props.create ? 0 : this.totalExp.value,
      pieCount: this.props.create ? 0 : this.pieCount.value,
      preferences: {
        emailInProfile: this.emailInProfile.checked ? true : false,
        lastLoginInProfile: this.lastLoginInProfile.checked ? true : false,
        accountNameInProfile: this.accountNameInProfile.checked ? true : false,
        vipStatusInProfile: this.vipStatusInProfile.checked ? true : false,
        pieCountInProfile: this.pieCountInProfile.checked ? true : false,
        levelInProfile: this.levelInProfile.checked ? true : false,
      },
      createdAt: this.props.create ? new Date() : this.props.character.createdAt,
      _id: this.props.create ? Random.id() : this.props.character._id,
      loggedIn: this.props.create ? false : this.props.character.loggedIn,
      status: this.props.create ? 'offline' : this.props.character.status,
      room: this.props.create ? '' : this.props.character.room,
      channel: this.props.create ? 'default' : this.props.character.channel,
      admin: this.props.create ? false : this.props.character.admin,
      globalModerator: this.props.create ? false : this.props.character.globalModerator,
      sysOp: this.props.create ? false : this.props.character.sysOp,
      textColor: this.props.create ? '#919191' : this.props.character.textColor,
      notifications: this.props.create ? [] : this.props.character.notifications,
      ignoreList: this.props.create ? [] : this.props.character.ignoreList,
      privateMessages: this.props.create ? [] : this.props.character.privateMessages,
      lastLogin: this.props.create ? null : this.props.character.lastLogin,
      refferals: this.props.create ? 0 : this.props.character.refferals,
      number: this.props.create ? this.props.numberOfCharacters+1 : this.props.character.number,
    };
    if (this.props.create) {
      Meteor.call('account.addCharacter', character, (error) => {
        if (error) {
          this.errorMessagesRef.current.innerHTML = error.reason;
          this.errorMessagesRef.current.style.display = 'block';
        } else {
          if (this.applyPreferences.checked) {
            Meteor.call('account.applyPreferences', character.preferences);
          }
          this.errorMessagesRef.current.innerHTML = '';
          this.errorMessagesRef.current.style.display = 'none';
          this.reset();
          this.hide();
        }
      });
    } else {
      Meteor.call('account.updateCharacter', character);
      if (this.applyPreferences.checked) {
        Meteor.call('account.applyPreferences', character.preferences);
      }
      this.errorMessagesRef.current.innerHTML = '';
      this.errorMessagesRef.current.style.display = 'none';
      this.reset();
      this.hide();
    }
  }

  render() {
    return (
      <div className="modal" ref={this.windowRef}>
        <div className="modalContent createCharacter">
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>{this.props.create ? 'CREATE CHARACTER' : 'EDIT CHARACTER'}</h4>
            <div className="errorMessages" ref={this.errorMessagesRef}></div>
          </div>
          <hr />
          <div className="formBox">
            <form>
              <div className="formRow">
                {this.props.create ? (
                  <><label htmlFor="nickname">Character Name</label><input type="text" className="formInput" ref={(input) => this.nickname = input} /></>
                ) : (
                  <><label htmlFor="nickname">Character Name</label><input type="text" className="formInput" ref={(input) => this.nickname = input} disabled /></>
                )}
              </div>
              <div className="formRow">
                <label htmlFor="personalMessage" className='vipFeature'>Personal Message</label><input type="text" className="formInput" ref={(input) => this.personalMessage = input} disabled />
              </div>
              <input type="radio" name="sfw" value="sfw" style={{marginLeft: '130px'}} ref={(input) => this.sfw = input} defaultChecked />SFW<input type="radio" name="sfw" value="nsfw" style={{marginLeft: '20px'}} ref={(input) => this.nsfw = input} />NSFW<br /><br />
              <span style={{marginLeft: '40px'}}>Gender</span>
              <input type="radio" name="gender" value="neutral" style={{marginLeft: '40px'}} ref={(input) => this.neutralGender = input} defaultChecked />Neutral
              <input type="radio" name="gender" value="male" style={{marginLeft: '20px'}} ref={(input) => this.maleGender = input} />Male
              <input type="radio" name="gender" value="female" style={{marginLeft: '20px'}} ref={(input) => this.femaleGender = input} />Female
            </form>
          </div>
          <hr />
          <div className="modalTitleBox">
            <h4>PROFILE</h4>
          </div>
          <hr />
          <div className="formBox">
            <form>
              <input type="radio" name="profile" value="default" ref={(input) => this.defaultProfile = input} defaultChecked />Default Profile
              <input type="radio" name="profile" value="css" style={{marginLeft: '20px'}} ref={(input) => this.cssProfile = input} disabled /><span className='vipFeature'>CSS Profile</span><br /><br />
              <ProfileEdit ref={this.profileEditRef} />
              <div style={{marginBottom: '60px'}}></div>
              <div className="formFlexContainer">
                <div className="formColumn">
                  <div className="formRow">
                    <label htmlFor="image" className='vipFeature'>Thumbnail Image</label>
                    <div className="formInput imageInputContainer">
                      <span ref="imageFile"></span>
                      <label htmlFor="image" className="imageInputLabel flatBlueButton">BROWSE</label><input type="file" disabled />
                    </div>
                  </div>
                  <div className="formRow">
                    <label htmlFor="skype">Skype</label><input type="text" className="formInput" ref={(input) => this.skype = input} />
                  </div>
                  <div className="formRow">
                    <label htmlFor="discord">Discord</label><input type="text" className="formInput" ref={(input) => this.discord = input} />
                  </div>
                  <div className="formRow">
                    <label htmlFor="Facebook">Facebook</label><input type="text" className="formInput" ref={(input) => this.facebook = input} />
                  </div>
                  <div className="formRow">
                    <label htmlFor="level" className='vipFeature'>Level</label><input type="text" className="formInput" ref={(input) => this.level = input} disabled />
                  </div>
                </div>
                <div className="formColumn">
                  <div className="formRow">
                    <label htmlFor="twitter">Twitter</label><input type="text" className="formInput" ref={(input) => this.twitter = input} />
                  </div>
                  <div className="formRow">
                    <label htmlFor="weburl">1 Web URL</label><input type="text" className="formInput" ref={(input) => this.weburl = input} />
                  </div>
                  <div className="formRow">
                    <label htmlFor="tags">Tags</label><input type="text" className="formInput" ref={(input) => this.tags = input} placeholder="#anime #detailed #group" />
                  </div>
                  <div className="formRow">
                    <label htmlFor="totalexp" className='vipFeature'>Total Exp</label><input type="text" className="formInput" ref={(input) => this.totalExp = input} disabled />
                  </div>
                  <div className="formRow">
                    <label htmlFor="piecount" className='vipFeature'>Pie Count</label><input type="text" className="formInput" ref={(input) => this.pieCount = input} disabled />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <hr />
          <div className="modalTitleBox">
            <h4>PREFERENCES</h4>
          </div>
          <hr />
          <div className="formBox">
            <form>
              <div className="formFlexContainer">
                <div className="formColumn">
                  <input type="checkbox" ref={(input) => this.emailInProfile = input} />Show email in public profile<br /><br />
                  <input type="checkbox" ref={(input) => this.lastLoginInProfile = input} />Show last login in public profile<br /><br />
                  <input type="checkbox" ref={(input) => this.accountNameInProfile = input} />Show account name in public profile<br /><br />
                </div>
                <div className="formColumn">
                  <input type="checkbox" ref={(input) => this.vipStatusInProfile = input} disabled /><span className='vipFeature'>Show VIP status in public profile</span><br /><br />
                  <input type="checkbox" ref={(input) => this.pieCountInProfile = input} disabled /><span className='vipFeature'>Show pie count in public profile</span><br /><br />
                  <input type="checkbox" ref={(input) => this.levelInProfile = input} disabled /><span className='vipFeature'>Show level in public profile</span><br /><br />
                </div>
              </div>
            </form>
          </div>
          <hr />
          <div className="formBox">
            <form>
              <input type="checkbox" ref={(input) => this.applyPreferences = input} />Apply preferences to all characters
              <div style={{marginBottom: '20px'}}></div>
              <button onClick={this.createCharacter} className="flatBlueButton createCharacterButton">{this.props.create ? 'CREATE' : 'SAVE'}</button>
              <button onClick={this.hide} className="flatBlueButton closeCharacterButton" style={{marginLeft: '10px'}}>CLOSE</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
