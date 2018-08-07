import React from 'react';
import { Meteor } from 'meteor/meteor';

import CreateCharacter from '../modals/CreateCharacter.js';
import CharacterSidebarEntry from './CharacterSidebarEntry.js';

import './CharacterSidebarList.css';

export default class CharacterSidebarList extends React.Component {
  constructor(props) {
    super(props);

    this.editCharacterRef = React.createRef();

    this.state = {
      editCharacter: null,
    }

    this.createCharacterEntry = this.createCharacterEntry.bind(this);
  }

  createCharacterEntry(character) {
    return (
      <CharacterSidebarEntry editCharacter={this.editCharacter.bind(this)} selected={this.props.selectedCharacter && this.props.selectedCharacter._id === character._id} character={character} key={character._id} />
    );
  }

  editCharacter(character) {
    this.setState({
      editCharacter: character,
    });
    this.editCharacterRef.current.show();
  }

  render() {
    return (
      <div className="characterList">
        {this.props.characters.map((character) => this.createCharacterEntry(character))}
        <CreateCharacter numberOfCharacters={this.props.numberOfCharacters} create={false} character={this.state.editCharacter} ref={this.editCharacterRef} />
      </div>
    );
  }
}
