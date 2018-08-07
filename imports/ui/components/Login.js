import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import CreateAccount from '../modals/CreateAccount.js';

import './Login.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.displayCreateForm = this.displayCreateForm.bind(this);
    this.logInUser = this.logInUser.bind(this);
    this.logInUserCallback = this.logInUserCallback.bind(this);
    this.resetLogInForm = this.resetLogInForm.bind(this);
  }

  resetLogInForm() {
    ReactDOM.findDOMNode(this.refs.username).value = '';
    ReactDOM.findDOMNode(this.refs.password).value = '';
  }

  displayCreateForm() {
    document.getElementById('createAccountModal').style.display = "block";
  }

  logInUser(event) {
    event.preventDefault();
    

    let username = ReactDOM.findDOMNode(this.refs.username).value;
    let password = ReactDOM.findDOMNode(this.refs.password).value;

    console.log(username);

    Meteor.loginWithPassword(username, password, this.logInUserCallback);
  }

  logInUserCallback(error) {
    let errorDiv = ReactDOM.findDOMNode(this.refs.loginErrorMessage);
    if (error) {
      errorDiv.innerHTML = error.reason;
      errorDiv.style.display = 'block';
    } else {
      errorDiv.style.display = 'none';
      this.resetLogInForm();
    }
  }

  render() {
    return (
      <div id="loginForm">
        <CreateAccount />
        <div id="createAccountBox">
          <h2>New User? Sign Up to chat Now!</h2>
          <button onClick={this.displayCreateForm} className="flatBlueButton">CREATE ACCOUNT</button>
        </div>
        <div id="loginBox">
          <div id="loginErrorMessage" ref="loginErrorMessage"></div>
          <h2>Already have an account? Login to chat now!</h2>
          <form onSubmit={this.logInUser}>
            <input type="text" id="username" className="formInput" ref="username" placeholder="Account Name" />
            <input type="password" id="password" className="formInput" ref="password" placeholder="Password" />
            <input type="submit" value="CHAT NOW" className="flatBlueButton" />
          </form>
        </div>
      </div>
    );
  }
}
