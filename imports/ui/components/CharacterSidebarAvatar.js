import React from 'react';
import { Meteor } from 'meteor/meteor';

import './CharacterSidebarAvatar.css';

export default class CharacterSidebarAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.avatarStatusMenuRef = React.createRef();

    this.setStatus = this.setStatus.bind(this);
    this.displayStatusMenu = this.displayStatusMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  displayStatusMenu() {
    if (this.avatarStatusMenuRef.current.style.display === 'block') {
      this.avatarStatusMenuRef.current.style.display = 'none';
    } else {
      this.avatarStatusMenuRef.current.style.display = 'block';
    }
  }

  setStatus(status) {
    Meteor.call('account.updateCharacterStatus', this.props.character, status);
    Meteor.call('rooms.updateCharacterStatus', this.props.character, status);
  }

  logout() {
    Meteor.call('account.logOutCharacter', this.props.character);
  }

  render() {
    return (
      <div className="avatar" onClick={this.displayStatusMenu}>
        {this.props.character.gender === 'Neutral' && <img src="./icons/neutralicon.png" width="32" height="32" /> }
        {this.props.character.gender === 'Male' && <img src="./icons/maleicon.png" width="32" height="32" /> }
        {this.props.character.gender === 'Female' && <img src="./icons/femaleicon.png" width="32" height="32" /> }
        <div className="avatarStatusMenu" ref={this.avatarStatusMenuRef}>
          <div className="avatarStatusMenuItem" onClick={this.setStatus.bind(this, 'online')}>Online<i className="fas fa-circle fa-xs" style={{color: 'green', display: 'inline', top: '10px'}}></i></div>
          <div className="avatarStatusMenuItem" onClick={this.setStatus.bind(this, 'idle')}>Idle<i className="fas fa-circle fa-xs" style={{color: 'yellow', display: 'inline', top: '40px'}}></i></div>
          <div className="avatarStatusMenuItem" onClick={this.setStatus.bind(this, 'notDisturb')}>Do not disturb<i className="fas fa-circle fa-xs" style={{color: 'red', display: 'inline', top: '70px'}}></i></div>
          <hr />
          <div className="avatarStatusMenuItem" onClick={this.logout}>Log out</div>
        </div>
      </div>
    );
  }
}
