import React from 'react';
import { Meteor } from 'meteor/meteor';

import CharacterSidebarAvatar from './CharacterSidebarAvatar.js';
import Status from './Status.js';

import './CharacterSidebarEntry.css';

export default class CharacterSidebarEntry extends React.Component {
  constructor(props) {
    super(props);

    this.select = this.select.bind(this);
    this.editCharacter = this.editCharacter.bind(this);
  }

  editCharacter() {
    this.props.editCharacter(this.props.character);
  }

  select() {
    Meteor.call('account.selectCharacter', this.props.character);
  }

  render() {
    return (
      <div className={this.props.selected ? 'characterListEntry characterListEntrySelected' : 'characterListEntry'}>
        <CharacterSidebarAvatar character={this.props.character} />
        <Status status={this.props.character.status} />
        <span className="characterNickname" onClick={this.select}>{this.props.character.nickname}</span>
        {this.props.character.notifications && this.props.character.notifications.length > 0 &&
          <span className="characterNotifications">{this.props.character.notifications.length}</span>
        }
        <i className="fas fa-pencil-alt" onClick={this.editCharacter} style={{marginLeft: '15px', color: '#919191'}}></i>
      </div>
    );
  }
}
