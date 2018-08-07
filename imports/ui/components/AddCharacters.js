import React from 'react';
import { Meteor } from 'meteor/meteor';

import './AddCharacters.css';

export default class AddCharacters extends React.Component {
  constructor(props) {
    super(props);

    this.enterCharacterBoxRef = React.createRef();
    this.enterCharacterRef = React.createRef();
    this.errorMessagesRef = React.createRef();

    this.state = {
      characters: [],
    };

    this.addCharacter = this.addCharacter.bind(this);
    this.displayEnterCharacter = this.displayEnterCharacter.bind(this);
    this.setCharacters = this.setCharacters.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear() {
    this.setState({
      characters: [],
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!this.nextProps) {
      return;
    }
    this.setState({
      characters: this.state.characters.concat(this.nextProps.characters),
    });
  }

  createCharacterEntry(character) {
    return (
      <div className='characterEntryAC' key={character}>
        {character}
        <i className="fas fa-minus-circle fa-sm minusButton" style={{zIndex: '0'}} onClick={this.removeCharacter.bind(this, character)}></i>
      </div>
    );
  }

  addCharacter(event) {
    event.preventDefault();
    if (this.state.characters.indexOf(this.enterCharacterRef.current.value) !== -1) {
      this.errorMessagesRef.current.style.display = 'block';
      return;
    }
    this.state.characters.push(this.enterCharacterRef.current.value);
    this.setState({
      characters: this.state.characters,
    });
    this.errorMessagesRef.current.style.display = 'none';
    this.enterCharacterRef.current.value = '';
    this.enterCharacterBoxRef.current.style.display = 'none';
  }

  removeCharacter(character) {
    this.setState({
      characters: this.state.characters.filter((char) => char !== character),
    });
  }

  displayEnterCharacter() {
    if (this.enterCharacterBoxRef.current.style.display === 'block') {
      this.enterCharacterBoxRef.current.style.display = 'none';
    } else {
      this.enterCharacterBoxRef.current.style.display = 'block';
    }
  }

  getCharacters() {
    return this.state.characters;
  }

  setCharacters(characters) {
    this.setState({
      characters: characters,
    });
  }

  render() {
    return (
      <div className="addCharacters formInput">
        {this.state.characters && this.state.characters.map((character) => this.createCharacterEntry(character))}
        <i className="fas fa-plus-circle fa-lg plusButton" onClick={this.displayEnterCharacter}></i>
        <div className='enterCharacterBox' ref={this.enterCharacterBoxRef}>
          <input className='formInput' type="text" placeholder="Character name" ref={this.enterCharacterRef} />
          <button className="flatBlueButton" style={{width: '80px', height: '35px'}} onClick={this.addCharacter}>ADD</button>
          <div style={{paddingBottom: '15px'}}></div>
          <div className="errorMessages" ref={this.errorMessagesRef}>Character already added</div>
        </div>
      </div>
    );
  }
}
