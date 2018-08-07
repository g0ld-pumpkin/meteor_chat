import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import '../../api/Accounts.js';
import './AccountManagment.css';

class AccountManagment extends React.Component {
  constructor(props) {
    super(props);

    this.windowRef = React.createRef();
    this.currentPasswordRef = React.createRef();
    this.newPasswordRef = React.createRef();
    this.repeatPasswordRef = React.createRef();
    this.successMessagePasswordRef = React.createRef();
    this.errorMessagePasswordRef = React.createRef();
    this.errorMessageAccountRef = React.createRef();
    this.confirmDeleteBoxRef = React.createRef();

    this.hide = this.hide.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordCallback = this.changePasswordCallback.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.hidePasswordChangeSuccess = this.hidePasswordChangeSuccess.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  hide() {
    this.windowRef.current.style.display = 'none';
  }

  hidePasswordChangeSuccess() {
    this.successMessagePasswordRef.current.style.display = 'none';
  }

  changePassword(event) {
    event.preventDefault();
    let currentPassword = this.currentPasswordRef.current.value;
    let newPassword = this.newPasswordRef.current.value;
    let repeatPassword = this.repeatPasswordRef.current.value;
    if (newPassword !== repeatPassword) {
      this.errorMessagePasswordRef.current.innerHTML = 'New password fields must match';
      this.errorMessagePasswordRef.current.style.display = 'block';
      return;
    }
    Accounts.changePassword(currentPassword, newPassword, this.changePasswordCallback);
  }

  changePasswordCallback(error) {
    let errorDiv = this.errorMessagePasswordRef.current;
    if (error) {
      errorDiv.innerHTML = error.reason;
      errorDiv.style.display = 'block';
    } else {
      errorDiv.innerHTML = '';
      errorDiv.style.display = 'none';
      this.successMessagePasswordRef.current.style.display = 'inline-block';
      Meteor.setTimeout(this.hidePasswordChangeSuccess, 2000);
    }
  }

  deleteAccount() {
    this.confirmDeleteBoxRef.current.style.display = 'none';
    Meteor.call('account.signOut');
    Meteor.call('account.delete', (error) => {
      if (error) {
        this.errorMessageAccountRef.current.style.display = 'block';
        this.errorMessageAccountRef.current.innerHTML = error.reason;
      } else {
        this.errorMessageAccountRef.current.style.display = 'none';
        this.hide();
      }
    });
  }

  cancelDelete() {
    this.confirmDeleteBoxRef.current.style.display = 'none';
  }

  confirmDelete(event) {
    event.preventDefault();
    this.confirmDeleteBoxRef.current.style.display = 'block';
  }

  render() {
    return (
      <div className="modal" id="accountManagmentModal" ref={this.windowRef}>
        <div className="modalContent accountManagment">
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>ACCOUNT MANAGMENT</h4>
          </div>
          <hr />
          <div className="formBox">
            <form onSubmit={this.createAccount}>
              <div className="formRow">
                <label htmlFor="username">Username</label><input type="text" className="formInput" placeholder={this.props.user && this.props.user.username} disabled /><span style={{fontSize: '12px', marginLeft: '130px', marginRight: '15px'}}>SHOP</span> <i className="fas fa-shopping-cart" style={{color: 'white', display: 'inline-block'}}></i>
              </div>
              <div className="formRow">
                <label htmlFor="email">Email Address</label><input type="text" className="formInput" placeholder={this.props.user && this.props.user.emails && this.props.user.emails[0].address} disabled />
              </div>
              <div className="formRow">
                <label htmlFor="usertype">User Type</label><input type="text" className="formInput" placeholder={this.props.user && this.props.user.profile.usertype} disabled /><button id="upgradeButton" className="flatBlueButton">UPGRADE TO VIP</button>
              </div>
              <div className="formRow">
                <label htmlFor="totalExperience">Total Experience</label><input type="text" className="formInput" placeholder={this.props.user && this.props.user.profile.totalExperience} disabled />
              </div>
              <div className="formRow">
                <label htmlFor="crystals" id="crystalLabel"><i className="far fa-gem" style={{color: '#5097d9'}}></i></label><input type="text" className="formInput" placeholder={this.props.user && this.props.user.profile.crystals} disabled />
              </div>
            </form>
          </div>
          <hr />
          <div className="modalTitleBox">
            <h4>CHANGE PASSWORD</h4>
            <div className="errorMessages" ref={this.errorMessagePasswordRef}></div>
          </div>
          <hr />
          <div className="formBox">
            <form onSubmit={this.changePassword}>
              <div className="formRow">
                <label htmlFor="currentPassword">Current Password</label><input type="text" className="formInput" ref={this.currentPasswordRef} />
              </div>
              <div className="formRow">
                <label htmlFor="newPassword">New Password</label><input type="password" className="formInput" ref={this.newPasswordRef} />
              </div>
              <div className="formRow">
                <label htmlFor="repeatPassword">Repeat Password</label><input type="password" className="formInput" ref={this.repeatPasswordRef} />
              </div>
              <input type="submit" value="CHANGE PASSWORD" id="changePasswordButton" className="flatBlueButton" /><span id="successMessagePassword" ref={this.successMessagePasswordRef}>Password changed</span>
            </form>
          </div>
          <hr />
          <div className="modalTitleBox">
            <h4>DELETE ACCOUNT</h4>
            <div className="errorMessages" ref={this.errorMessageAccountRef}></div>
          </div>
          <hr />
          <div className="formBox deleteBox">
            <div id="confirmDeleteBox" ref={this.confirmDeleteBoxRef}>
              <p>Are you sure you want to delete your account? All your characters will be lost</p>
              <button className="flatBlueButton" onClick={this.deleteAccount} style={{marginLeft: '150px'}}>YES</button>
              <button className="flatBlueButton" onClick={this.cancelDelete}>NO</button>
            </div>
            <form onSubmit={this.confirmDelete}>
              <input type="submit" value="DELETE" id="deleteAccountButton" className="flatBlueButton" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(AccountManagment);
