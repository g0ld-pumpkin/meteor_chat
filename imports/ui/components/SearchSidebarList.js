import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SearchSidebarEntry from './SearchSidebarEntry.js';

import './SearchSidebarList.css';

export default class SearchSidebarList extends React.Component {
  constructor(props) {
    super(props);

    this.createCharacterEntry = this.createCharacterEntry.bind(this);
    this.compareCharacters = this.compareCharacters.bind(this);
    this.compareCharactersSearchResult = this.compareCharactersSearchResult.bind(this);
    this.isRoomModerator = this.isRoomModerator.bind(this);
  }

  componentWillMount() {
    if (this.props.activeRoom) {
      this.props.activeRoom.characters.sort(this.compareCharacters);
    } else if (this.props.characters) {
      this.props.characters.sort(this.compareCharactersSearchResult);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.activeRoom) {
      nextProps.activeRoom.characters.sort(this.compareCharacters);
    } else if (nextProps.characters) {
      nextProps.characters.sort(this.compareCharactersSearchResult);
    }
  }

  compareCharacters(characterA, characterB) {
    if (characterA.sysOp && !characterB.sysOp) {
      return -1;
    }
    if (characterB.sysOp && !characterA.sysOp) {
      return 1;
    }
    if (characterA.admin && !characterB.sysOp && !characterB.admin) {
      return -1;
    }
    if (characterB.admin && !characterA.sysOp && !characterA.admin) {
      return 1;
    }
    if (characterA.globalModerator && !characterB.sysOp && !characterB.admin && !characterB.globalModerator) {
      return -1;
    }
    if (characterB.globalModerator && !characterA.sysOp && !characterA.admin && !characterA.globalModerator) {
      return 1;
    }
    if (this.isRoomModerator(characterA) && !characterB.sysOp && !characterB.admin && !characterB.globalModerator && !this.isRoomModerator(characterB)) {
      return -1;
    }
    if (this.isRoomModerator(characterB) && !characterA.sysOp && !characterA.admin && !characterA.globalModerator && !this.isRoomModerator(characterA)) {
      return 1;
    }
    if (characterA.nickname < characterB.nickname) {
      return -1;
    }
    if (characterB.nickname < characterA.nickname) {
      return 1;
    }
    return 0;
  }

  compareCharactersSearchResult(characterA, characterB) {
    if (characterA.status === 'online' && characterB.status !== 'online') {
      return -1;
    }
    if (characterB.status === 'online' && characterA.status !== 'online') {
      return 1;
    }
    if (characterA.nickname < characterB.nickname) {
      return -1;
    }
    if (characterB.nickname < characterA.nickname) {
      return 1;
    }
    return 0;
  }

  createCharacterEntry(character) {
    return (
      <SearchSidebarEntry searchResult={false} moderator={this.isRoomModerator(character)} creator={this.props.activeRoom.creator === character._id} selected={this.props.selectedCharacter && this.props.selectedCharacter._id === character._id} character={character} key={character._id} />
    );
  }

  createSearchResultCharacterEntry(character) {
    return (
      <SearchSidebarEntry searchResult={true} character={character} key={character._id} />
    );
  }

  isRoomModerator(character) {
    if (!this.props.activeRoom) {
      return false;
    }
    let moderator = false;
    this.props.activeRoom.moderators.forEach((moderator) => {
      if (moderator._id === character._id) {
        moderator = true;
      }
    });
    return moderator;
  }

  render() {
    return (
      <div className="characterList">
        {this.props.activeRoom &&
          this.props.activeRoom.characters.map((character) => this.createCharacterEntry(character))
        }
        {this.props.characters &&
          this.props.characters.map((character) => this.createSearchResultCharacterEntry(character))
        }
      </div>
    );
  }
}
