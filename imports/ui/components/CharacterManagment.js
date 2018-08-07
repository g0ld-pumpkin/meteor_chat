import React from 'react';
import { Meteor } from 'meteor/meteor';

import CreateCharacter from '../modals/CreateCharacter.js';

import './CharacterManagment.css';

export default class CharacterManagment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCharacter: null,
      create: true,
    }

    this.confirmDeleteCharacterBoxRef = React.createRef();
    this.createCharacterRef = React.createRef();

    this.createCharacter = this.createCharacter.bind(this);
    this.createCharacterEntry = this.createCharacterEntry.bind(this);
    this.deleteCharacter = this.deleteCharacter.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  createCharacterEntry(character) {
    return (
      <div className="characterEntry" key={character.createdAt}>
        <span id="characterNickname">{character.nickname}</span>
        <span id="characterLevel">{character.level}</span>
        <span id="characterActions">
          <a href={`/c/${character.nickname}`} target='_blank' style={{ color: 'inherit', textDecoration: 'none'}}><i className="far fa-eye" title='View profile'></i></a>
          <i className="fas fa-pencil-alt" style={{marginLeft: '8px'}} title='Edit character' onClick={this.editCharacter.bind(this, character)}></i>
          <i className="fas fa-trash-alt" style={{marginLeft: '8px'}} title='Delete character' onClick={this.confirmDelete.bind(this, character)}></i>
        </span>
        <div className="confirmDeleteCharacterBox">
          Are you sure you want to delete this character permanently<br /><br />
          <button className="flatBlueButton" onClick={this.deleteCharacter}>YES</button>
          <button className="flatBlueButton" style={{border: '1px solid #3198db', background: '#111111'}} onClick={this.cancelDelete}>NO</button>
        </div>
      </div>
    );
  }

  createCharacter() {
    this.setState({
      selectedCharacter: null,
      create: true,
    });
    this.createCharacterRef.current.show();
  }

  editCharacter(character) {
    this.setState({
      selectedCharacter: character,
      create: false,
    });
    this.createCharacterRef.current.show();
  }

  deleteCharacter() {
    Meteor.call('account.deleteCharacter', this.state.selectedCharacter);
    this.setState({
      selectedCharacter: null,
      create: true,
    })
  }

  confirmDelete(character, event) {
    this.setState({
      selectedCharacter: character,
    });
    event.target.parentNode.nextSibling.style.display = 'block';
  }

  cancelDelete(event) {
    event.target.parentNode.style.display = 'none';
  }

  render() {
    return (
      <div id="characterManagment">
          <CreateCharacter numberOfCharacters={this.props.numberOfCharacters} create={this.state.create} character={this.state.selectedCharacter} ref={this.createCharacterRef} />
          <button onClick={this.createCharacter} className="flatBlueButton" style={{width: '150px', display: 'block', margin: '15px auto'}}>CREATE A CHARACTER</button>
          <div id="characterHeader">
            <span style={{marginLeft: '10px'}}>Nickname</span>
            <span style={{marginLeft: '30px'}}>Level</span>
            <span style={{marginLeft: '60px'}}>Options</span>
          </div>
          <div id="characterEntries">
            {this.props.characters.map((character) => this.createCharacterEntry(character))}
          </div>
      </div>
    );
  }
}
