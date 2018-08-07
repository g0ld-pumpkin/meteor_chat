import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import './Character.css';

class Character extends React.Component {
  constructor(props) {
    super(props);

    this.characterRef = React.createRef();
    this.saveDoneRef = React.createRef();
    this.errorRef = React.createRef();

    this.state = {
      deleted: false,
    };

    this.fillCharacterFields = this.fillCharacterFields.bind(this);
    this.saveCharacter = this.saveCharacter.bind(this);
    this.deleteCharacter = this.deleteCharacter.bind(this);
  }

  saveCharacter() {
    let character = {
      _id: this.props.character._id,
      nickname: this.nickname.value,
      gender: this.gender.value,
      description: this.description.value,
      avatar: this.avatar.value,
      socialMedia: {
        skype: this.skype.value,
        facebook: this.facebook.value,
        twitter: this.twitter.value,
        discord: this.discord.value,
      },
      sysOp: this.sysop.value === 'Yes' ? true : false,
      admin: this.admin.value === 'Yes' ? true : false,
      globalModerator: this.globalModerator.value === 'Yes' ? true : false,
      weburl: this.website.value,
      preferences: {
        emailInProfile: this.showEmail.checked,
        lastLoginInProfile: this.showLastLogin.checked,
      },
      refferals: this.refferals.value,
    };
    Meteor.call('account.character.update', this.props.account, character, (error) => {
      if (error) {
        this.errorRef.current.innerHTML = error.reason;
        this.errorRef.current.style.display = 'block';
      } else {
        this.errorRef.current.innerHTML = '';
        this.errorRef.current.style.display = 'none';
        this.saveDoneRef.current.style.display = 'inline-block';
        Meteor.setTimeout(() => {
          this.saveDoneRef.current.style.display = 'none';
        }, 3000);
      }
    });
  }

  deleteCharacter() {
    Meteor.call('account.deleteCharacter', this.props.character);
    this.setState({
      deleted: true,
    });
  }

  componentDidMount() {
    this.fillCharacterFields();
  }

  componentDidUpdate() {
    this.fillCharacterFields();
  }

  fillCharacterFields() {
    if (!this.props.character) {
      return;
    }
    this.nickname.value = this.props.character.nickname;
    this.number.value = this.props.character.number;
    this.user.value = this.props.account.username;
    this.group.value = this.props.character.sysOp ? 'SysOp' : this.props.character.admin ? 'Admin' : this.props.character.globalModerator ? 'Global Moderator' : 'User';
    this.gender.value = this.props.character.gender;
    this.description.value = this.props.character.profile.html;
    this.avatar.value = this.props.character.avatar;
    this.skype.value = this.props.character.socialMedia.skype;
    this.facebook.value = this.props.character.socialMedia.facebook;
    this.twitter.value = this.props.character.socialMedia.twitter;
    this.discord.value = this.props.character.socialMedia.discord;
    this.sysop.value = this.props.character.sysOp ? 'Yes' : 'No';
    this.admin.value = this.props.character.admin ? 'Yes' : 'No';
    this.globalModerator.value = this.props.character.globalModerator ? 'Yes' : 'No';
    this.website.value = this.props.character.weburl;
    this.showEmail.checked = this.props.character.preferences.emailInProfile;
    this.showLastLogin.checked = this.props.character.preferences.lastLoginInProfile;
    this.refferals.value = this.props.character.refferals;
  }

  render() {
    return (
      <div className="character" ref={this.accountRef}>
        {this.state.deleted && <Redirect to='/admin/characters?page=1' />}
        <div className='adminPanelFormRow'>
          <label htmlFor='nickname' className='firstInput'>Nickname</label><input className='formInput accountsInput' style={{width: '55%', minWidth: '200px', marginRight: '25px'}} type='text' id='nickname' ref={(input) => this.nickname = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='number'>ID</label><input className='formInput accountsInput' style={{marginRight: '25px'}} type='text' id='number' ref={(input) => this.number = input} disabled />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='user' className='firstInput'>User</label><input className='formInput accountsInput' style={{width: '73%', minWidth: '200px', marginRight: '25px'}} type='text' id='user' ref={(input) => this.user = input} disabled />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='group' className='firstInput'>Group</label><input className='formInput accountsInput' style={{width: '35%', minWidth: '200px', marginRight: '25px'}} type='text' id='group' ref={(input) => this.group = input} disabled />
          <label htmlFor='number'>Gender</label><input className='formInput accountsInput' style={{width: '33%', minWidth: '200px', marginRight: '25px'}} type='text' id='gender' ref={(input) => this.gender = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='description' className='firstInput' style={{verticalAlign: 'top'}}>Description</label><textarea className='formInput accountCharacters' style={{width: '73%', height: '200px', overflow: 'auto', resize: 'none'}} id='description' ref={(input) => this.description = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='avatar' className='firstInput'>Avatar</label><input className='formInput accountsInput' style={{width: '35%', minWidth: '200px', marginRight: '25px'}} type='text' id='avatar' ref={(input) => this.avatar = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='skype'>Skype</label><input className='formInput accountsInput' style={{width: '33%', marginRight: '25px'}} type='text' id='skype' ref={(input) => this.skype = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='facebook' className='firstInput'>Facebook</label><input className='formInput accountsInput' style={{width: '20%', minWidth: '200px', marginRight: '45px'}} type='text' id='facebook' ref={(input) => this.facebook = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='twitter'>Twitter</label><input className='formInput accountsInput' style={{width: '20%', marginRight: '45px'}} type='text' id='twitter' ref={(input) => this.twitter = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='discord'>Discord</label><input className='formInput accountsInput' style={{width: '20%', marginRight: '45px'}} type='text' id='discord' ref={(input) => this.discord = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='sysop' className='firstInput'>SysOp</label><input className='formInput accountsInput' style={{width: '18%', minWidth: '200px', marginRight: '45px'}} type='text' id='sysop' ref={(input) => this.sysop = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='admin'>Admin</label><input className='formInput accountsInput' style={{width: '18%', marginRight: '45px'}} type='text' id='admin' ref={(input) => this.admin = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='globalModerator'>Global Moderator</label><input className='formInput accountsInput' style={{width: '18%', marginRight: '45px'}} type='text' id='globalModerator' ref={(input) => this.globalModerator = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='website' className='firstInput'>Website</label><input className='formInput accountsInput' style={{width: '33%', minWidth: '200px', marginRight: '25px'}} type='text' id='website' ref={(input) => this.website = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor='website2'>Website 2</label><input className='formInput accountsInput' style={{width: '33%', marginRight: '25px'}} type='text' id='website2' ref={(input) => this.website2 = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='showEmail' className='firstInput' style={{verticalAlign: 'super'}}>Show Email</label>
          <label className="switch" style={{marginLeft: '20px', marginRight: '30px'}}>
            <input type="checkbox" id='showEmail' ref={(input) => this.showEmail = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
            <span className="slider round"></span>
          </label>
          <label htmlFor='showLastLogin' style={{verticalAlign: 'super'}}>Show Last Login</label>
          <label className="switch" style={{marginLeft: '20px', marginRight: '30px'}}>
            <input type="checkbox" id='showLastLogin' ref={(input) => this.showLastLogin = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='refferals' className='firstInput'>Refferals</label><input className='formInput accountsInput' style={{width: '71%'}} type='text' id='refferals' ref={(input) => this.refferals = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp &&
            <>
              <button className='flatBlueButton' style={{marginLeft: '120px', marginRight: '10px', width: '120px'}} onClick={this.saveCharacter}>SAVE</button>
              <button className="flatBlueButton" style={{marginRight: '20px', border: '1px solid #3198db', background: '#111111', width: '120px'}} onClick={this.deleteCharacter}>DELETE</button>
            </>
          }
          <Link to='/admin/characters?page=1'><span className='backToListing' style={{color: 'white', marginLeft: '40px'}}>BACK TO LISTING</span></Link><br /><br />
          <div style={{color: 'red', marginLeft: '100px'}} ref={this.errorRef}></div>
          <i className="fas fa-check fa-lg" style={{color: 'green', display: 'none', marginLeft: '160px'}} ref={this.saveDoneRef}></i>
        </div>
      </div>
    );
  }
}

export default withTracker(({ match }) => {
  Meteor.subscribe('account.all');
  let characterName = match.params.characterName;

  return {
    character: _.flatten(Meteor.users.find({ 'profile.characters.nickname': characterName }).fetch().map(account => account.profile.characters)).filter(character => character.nickname === characterName)[0],
    account: Meteor.users.find({ 'profile.characters.nickname': characterName }).fetch()[0],
    user: Meteor.user(),
  };
})(Character);
