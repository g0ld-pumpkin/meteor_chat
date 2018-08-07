import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './CreateAccount.css';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.usernameRef = React.createRef();
    this.emailRef = React.createRef();
    this.usertypeRef = React.createRef();
    this.passwordRef = React.createRef();
    this.passwordRepeatRef = React.createRef();
    this.securityRef = React.createRef();
    this.refferedByRef = React.createRef();
    this.windowRef = React.createRef();
    this.errorMessagesRef = React.createRef();

    this.reset = this.reset.bind(this);
    this.hide = this.hide.bind(this);
    this.createAccountCallback = this.createAccountCallback.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  reset() {
    this.usernameRef.current.value = '';
    this.emailRef.current.value = '';
    this.usertypeRef.current.value = '';
    this.passwordRef.current.value = '';
    this.passwordRepeatRef.current.value = '';
    this.securityRef.current.value = '';
    this.refferedByRef.current.value = '';
  }

  hide() {
    this.windowRef.current.style.display = 'none';
  }

  createAccount(event) {
    event.preventDefault();
    let username = this.usernameRef.current.value;
    let email = this.emailRef.current.value;
    let password = this.passwordRef.current.value
    let passwordRepeat = this.passwordRepeatRef.current.value
    let errorDiv = this.errorMessagesRef.current;
    if (!username || !email || !password || !passwordRepeat) {
      errorDiv.innerHTML = 'All mandatory fields must be set';
      errorDiv.style.display = 'block';
      return;
    }
    let usernameValidation = new RegExp('^[a-zA-Z0-9]{1,14}$');
    if (usernameValidation.test(username) === false) {
      errorDiv.innerHTML = 'Username can only contain letters and number and must be less than 15 characters';
      errorDiv.style.display = 'block';
      return;
    }
    if (password != passwordRepeat) {
      errorDiv.innerHTML = 'Password fields must match';
      errorDiv.style.display = 'block';
      return;
    }
    let security = this.securityRef.current.value;
    let refferer = this.refferedByRef.current.value;
    $.getJSON("http://api.db-ip.com/v2/free/self").then((addrInfo) => {
      Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          usertype: "Member",
          security: security,
          refferals: 0,
          refferedby: refferer,
          totalExperience: 0,
          crystals: 0,
          createdAt: new Date(),
          characters: [],
          selectedCharacter: null,
          actionsTaken: [],
          ipAddress: addrInfo.ipAddress,
          notes: [],
          number: this.props.numberOfAccounts+1,
          lastLogin: new Date(),
          banned: false,
          dateBanned: null,
          settings: {
            timestamps: false,
            joinsActiveRoom: false,
            sendsMessageInActiveRoom: false,
            tagsYou: false,
            sendsYouPersonalMessage: false,
            muteAllSounds: false,
            disableEmojis: false,
            theme: 'rpnight',
          },
      }}, this.createAccountCallback);
    });
  }

  createAccountCallback(error) {
    let errorDiv = this.errorMessagesRef.current;
    if (error) {
      errorDiv.innerHTML = error.reason;
      errorDiv.style.display = 'block';
    } else {
      errorDiv.style.display = 'none';
      this.reset();
      this.hide();
    }
  }

  render() {
    return (
      <div id="createAccountModal" ref={this.windowRef} className="modal">
        <div className="modalContent">
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>CREATE ACCOUNT</h4>
            <div className="errorMessages" ref={this.errorMessagesRef}></div>
          </div>
          <hr />
          <div className="formBox">
            <form onSubmit={this.createAccount}>
              <div className="formRow">
                <label htmlFor="username">Username</label><input type="text" id="username" className="formInput" ref={this.usernameRef} /><span className="mandatoryFields">*</span>
              </div>
              <div className="formRow">
                <label htmlFor="email">Email Address</label><input type="text" id="email" className="formInput" ref={this.emailRef} /><button id="verifyButton" className="flatBlueButton">VERIFY</button><span className="mandatoryFields">*</span>
              </div>
              <div className="formRow">
                <label htmlFor="usertype" className='vipFeature'>User Type</label><input type="text" id="usertype" className="formInput" ref={this.usertypeRef} disabled /><button id="upgradeButton" className="flatBlueButton" disabled>UPGRADE TO VIP</button>
              </div>
              <div className="formRow">
                <label htmlFor="password">Create Password</label><input type="password" id="password" className="formInput" ref={this.passwordRef} /><span className="mandatoryFields">*</span>
              </div>
              <div className="formRow">
                <label htmlFor="passwordRepeat">Repeat Password</label><input type="password" id="passwordRepeat" className="formInput" ref={this.passwordRepeatRef} /><span className="mandatoryFields">*</span>
              </div>
              <div className="formRow">
                <label htmlFor="security">Security Question</label><input type="text" id="security" className="formInput" ref={this.securityRef} />
              </div>
              <div className="formRow">
                <label htmlFor="refferedBy">Reffered By</label><input type="text" id="refferedBy" className="formInput" ref={this.refferedByRef} />
              </div>
              <input type="submit" value="SIGN UP" id="signUpButton" className="flatBlueButton" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('account.all');

  return {
    numberOfAccounts: Meteor.users.find({}).count(),
  };
})(CreateAccount);
