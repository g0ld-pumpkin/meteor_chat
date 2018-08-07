import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Backup } from '../../../api/Accounts.js';

import Notes from '../../modals/Notes.js';

import './Account.css';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.accountRef = React.createRef();
    this.saveDoneRef = React.createRef();

    this.state = {
      deleted: false,
    };

    this.isBanned = null;

    this.fillAccountFiels = this.fillAccountFields.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.getCharactersString = this.getCharactersString.bind(this);
    this.getRolesString = this.getRolesString.bind(this);
    this.saveAccount = this.saveAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.banToggled = this.banToggled.bind(this);
  }

  banToggled() {
    if (this.banned.value === 'Yes' && this.isBanned === false) {
      return true;
    }
    if (this.banned.value === 'No' && this.isBanned === true) {
      return true;
    }
    return false;
  }

  saveAccount() {
    if (this.banToggled()) {
      if (this.banned.value === 'Yes') {
        Meteor.call('account.ban', this.props.account._id);
      } else {
        Meteor.call('account.unban', this.props.account._id);
      }
    }
    let account = {
      _id: this.props.account._id,
      totalExperience: this.totalExp.value,
      crystals: this.crystals.value,
      ipAddress: this.ipAddress.value,
      refferals: this.refferals.value,
      email: this.email.value,
    };
    if (this.props.backup) {
      Meteor.call('account.backup.update', account);
    } else {
      Meteor.call('account.update', account);
    }
    this.saveDoneRef.current.style.display = 'inline-block';
    Meteor.setTimeout(() => {
      this.saveDoneRef.current.style.display = 'none';
    }, 3000);
  }

  deleteAccount() {
    if (this.props.backup) {
      Meteor.call('account.backup.remove', this.props.account._id);
    } else {
      Meteor.call('account.remove', this.props.account._id);
    }
    this.setState({
      deleted: true,
    });
  }

  componentDidMount() {
    this.fillAccountFields();
  }

  componentDidUpdate() {
    this.fillAccountFields();
  }

  fillAccountFields() {
    if (!this.props.account) {
      return;
    }
    this.username.value = this.props.account.username;
    this.totalExp.value = this.props.account.profile.totalExperience;
    this.crystals.value = this.props.account.profile.crystals;
    this.email.value = this.props.account.emails[0].address;
    this.characters.value = this.getCharactersString();
    this.lastLogin.value = this.props.account.profile.lastLogin.toUTCString();
    this.accountCreated.value = this.props.account.profile.createdAt.toUTCString();
    this.ipAddress.value = this.props.account.profile.ipAddress;
    this.roles.value = this.getRolesString();
    this.banned.value = this.props.account.profile.banned ? 'Yes' : 'No';
    this.refferals.value = this.props.account.profile.refferals;
    this.isBanned = this.props.account.profile.banned;
    console.log('state banned');
    console.log(this.isBanned);
  }

  displayNotes() {
    this.accountRef.current.firstChild.style.display = 'block';
  }

  getCharactersString() {
    let characterString = '';
    this.props.account.profile.characters.forEach(character => {
      characterString += `${character.nickname}\n`
    });
    return characterString;
  }

  getRolesString() {
    let roles = [];
    this.props.account.profile.characters.forEach((character) => {
      if (character.sysOp) {
        roles.push('SysOp');
      }
      if (character.admin) {
        roles.push('Admin');
      }
      if (character.globalModerator) {
        roles.push('GM');
      }
      if (!character.sysOp && !character.admin && !character.globalModerator) {
        roles.push('User');
      }
    });
    let roleString = '';
    roles = _.uniq(roles);
    roles.forEach(role => {
      roleString += `${role}\n`;
    });
    return roleString;
  }

  render() {
    return (
      <div className="account" ref={this.accountRef}>
        {this.state.deleted && <Redirect to='/admin/accounts?page=1' />}
        {this.props.account && <Notes notes={this.props.account.profile.notes} accountName={this.props.account.username} />}
        <div className='adminPanelFormRow'>
          <label htmlFor='username' className='firstInput'>Username</label><input className='formInput accountsInput' style={{width: '35%', minWidth: '200px', marginRight: '25px'}} type='text' id='username' ref={(input) => this.username = input} disabled />
          <label htmlFor='totalExp'>Total Exp</label><input className='formInput accountsInput' style={{marginRight: '25px'}} type='text' id='totalExp' ref={(input) => this.totalExp = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <label htmlFor="crystals" id="crystalLabel"><i className="far fa-gem" style={{color: '#5097d9'}}></i></label><input type="text" id="crystals" ref={(input) => this.crystals = input} className="formInput accountsInput" disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          <button className='flatBlueButton' style={{width: '120px'}} onClick={this.displayNotes}>NOTES</button>
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='email' className='firstInput'>Email</label><input className='formInput accountsInput' style={{width: '71%'}} type='text' id='email' ref={(input) => this.email = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
          {this.props.account && this.props.account.emails[0].verified &&
            <>
              <i className="fas fa-check fa-lg" style={{color: 'green'}}></i>
              <span style={{marginLeft: '10px'}}>Verified</span>
            </>
          }
          {this.props.account && !this.props.account.emails[0].verified &&
            <>
              <i className="fas fa-times fa-lg" style={{color: 'red'}}></i>
              <span style={{marginLeft: '10px'}}>Verified</span>
            </>
          }
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='characters' className='firstInput' style={{verticalAlign: 'top'}}>Characters</label><textarea className='formInput accountCharacters' style={{width: '71%', height: '200px', overflow: 'auto', resize: 'none'}} id='characters' ref={(input) => this.characters = input} disabled />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='lastLogin' className='firstInput'>Last Login</label><input className='formInput accountsInput' style={{width: '30%', marginRight: '40px'}} type='text' id='lastLogin' ref={(input) => this.lastLogin = input} disabled />
          <label htmlFor='accountCreated'>Account Created</label><input className='formInput accountsInput' style={{width: '30%'}} type='text' id='accountCreated' ref={(input) => this.accountCreated = input} disabled />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='ipAddress' className='firstInput'>IP Address</label><input className='formInput accountsInput' style={{width: '71%'}} type='text' id='ipAddress' ref={(input) => this.ipAddress = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='roles' className='firstInput' style={{verticalAlign: 'top'}}>Roles</label><textarea className='formInput accountRoles' style={{width: '71%', height: '100px', overflow: 'auto', resize: 'none'}} id='roles' ref={(input) => this.roles = input} disabled />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='banned' className='firstInput'>Banned</label><input className='formInput accountsInput' style={{width: '71%'}} type='text' id='banned' ref={(input) => this.banned = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          <label htmlFor='refferals' className='firstInput'>Refferals</label><input className='formInput accountsInput' style={{width: '71%'}} type='text' id='refferals' ref={(input) => this.refferals = input} disabled={this.props.user && (!this.props.user.profile.selectedCharacter || this.props.user.profile.selectedCharacter && !this.props.user.profile.selectedCharacter.sysOp)} />
        </div>
        <div className='adminPanelFormRow'>
          {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp &&
            <>
              <button className='flatBlueButton' style={{marginLeft: '120px', marginRight: '10px', width: '120px'}} onClick={this.saveAccount}>SAVE</button>
              <button className="flatBlueButton" style={{marginRight: '20px', border: '1px solid #3198db', background: '#111111', width: '120px'}} onClick={this.deleteAccount}>DELETE</button>
            </>
          }
          <Link to={this.props.backup ? '/admin/backup?page=1' : '/admin/accounts?page=1'}><span className='backToListing' style={{color: 'white', marginLeft: '40px'}}>BACK TO LISTING</span></Link><br /><br />
          <i className="fas fa-check fa-lg" style={{color: 'green', display: 'none', marginLeft: '160px'}} ref={this.saveDoneRef}></i>
        </div>
      </div>
    );
  }
}

export default withTracker(({ match }) => {
  Meteor.subscribe('account.all');
  Meteor.subscribe('account.backup.all');
  console.log(match);
  let backup = match.url.indexOf('/admin/backup/') === 0;
  let accountName = backup ? match.params.accountNameBackup : match.params.accountName;

  return {
    account: backup ? Backup.find({ username: accountName }).fetch()[0] : Meteor.users.find({ username: accountName }).fetch()[0],
    user: Meteor.user(),
    backup: backup,
  };
})(Account);
