import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import ChatSettings from '../modals/ChatSettings.js';
import AccountManagment from '../modals/AccountManagment.js';

import './Sidebar.css';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.chatSettingsRef = React.createRef();

    this.state = {
      characterManagmentIcon: false,
    };

    this.logOutUser = this.logOutUser.bind(this);
    this.displayAccountManagment = this.displayAccountManagment.bind(this);
    this.displayCharacterManagment = this.displayCharacterManagment.bind(this);
    this.displayChatSettings = this.displayChatSettings.bind(this);
    this.showCharacterManagmentIcon = this.showCharacterManagmentIcon.bind(this);
  }

  logOutUser() {
    Meteor.call('account.signOut');
    Meteor.logout();
  }

  displayAccountManagment() {
    document.getElementById('accountManagmentModal').style.display = "block";
  }

  displayCharacterManagment() {
    this.setState({
      characterManagmentIcon: false,
    });
    this.props.middleSectionRef.showCharacterSidebar();
  }

  displayChatSettings() {
    this.chatSettingsRef.current.show();
  }

  showCharacterManagmentIcon() {
    this.setState({
      characterManagmentIcon: true,
    });
  }

  render() {
    return (
      <div id="sidebar">
        <AccountManagment />
        <div style={{marginBottom: '15px'}}></div>
        <i className="fas fa-exclamation-circle fa-2x" style={{color: 'grey'}}></i>
        <i className="far fa-question-circle fa-2x" style={{color: 'grey'}}></i>
        <img src="/icons/forum.png" style={{marginBottom: '15px'}}/>
        <i className="fab fa-discord fa-2x" style={{color: '#6480bf'}}></i>
        <i className="fab fa-facebook fa-2x" style={{color: '#3c5a9a'}}></i>
        <i className="fab fa-twitter-square fa-2x" style={{color: '#28aae1'}}></i>
        <ChatSettings user={this.props.user} ref={this.chatSettingsRef} />
        <div id="bottomIcons">
          {this.props.user && this.state.characterManagmentIcon &&
            <i className="fas fa-users-cog fa-lg" style={{color: 'grey'}} title="Character Managment" onClick={this.displayCharacterManagment}></i>
          }
          {this.props.user && <i className="fas fa-sign-out-alt fa-lg" style={{color: 'grey'}} title="Sign Out" onClick={this.logOutUser}></i>}
          {this.props.user && <i className="fas fa-cogs fa-lg" style={{color: 'grey'}} title="Chat Settings" onClick={this.displayChatSettings}></i>}
          {this.props.user && <i className="fas fa-user fa-lg" style={{color: 'grey'}} title="Account Managment" onClick={this.displayAccountManagment}></i>}
          {this.props.user && this.props.user.profile.selectedCharacter && (this.props.user.profile.selectedCharacter.sysOp || this.props.user.profile.selectedCharacter.admin) &&
            <><Link to='/admin'><i className="fas fa-lock fa-lg" style={{color: 'grey'}} title="Admin Panel"></i></Link></>
          }
        </div>
      </div>
    );
  }
}
