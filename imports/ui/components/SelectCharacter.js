import React from 'react';
import { Meteor } from 'meteor/meteor';

import './SelectCharacter.css';

export default class SelectCharacter extends React.Component {
  constructor(props) {
    super(props);

    this.selectCharacterArrowRef = React.createRef();
    this.characterListEntriesRef = React.createRef();
    this.state = {
      visible: false,
      selectedCharacter: null,
    };

    this.displayCharacterList = this.displayCharacterList.bind(this);
    this.createCharacterEntry = this.createCharacterEntry.bind(this);
    this.selectCharacter = this.selectCharacter.bind(this);
    this.getSelectedCharacter = this.getSelectedCharacter.bind(this);
  }

  displayCharacterList() {
    if (this.state.visible) {
      this.characterListEntriesRef.current.style.display = 'none';
      this.selectCharacterArrowRef.current.src = './icons/downarrow.png';
      this.state.visible = false;
    } else {
      this.characterListEntriesRef.current.style.display = 'block';
      this.selectCharacterArrowRef.current.src = './icons/uparrow.png';
      this.state.visible = true;
    }
  }

  createCharacterEntry(character) {
    return (
      <div className="selectCharacterEntry" key={character._id} onClick={this.selectCharacter.bind(this, character)}>
        {character.nickname}
        <hr />
      </div>
    );
  }

  selectCharacter(character) {
    this.setState({
      selectedCharacter: character,
    });
    this.displayCharacterList();
  }

  getSelectedCharacter() {
    return this.state.selectedCharacter;
  }

  reset() {
    this.setState({
      selectedCharacter: null,
    });
  }

  render() {
    return (
      <div className="selectCharacter">
        <span>{this.state.selectedCharacter ? this.state.selectedCharacter.nickname : 'Choose a character'}</span>
        <img src="./icons/downarrow.png" className="downArrow" ref={this.selectCharacterArrowRef} onClick={this.displayCharacterList.bind(this)} />
        <div className="selectCharacterListEntries" ref={this.characterListEntriesRef}>
          {this.props.characters && this.props.characters.map((character) => this.createCharacterEntry(character))}
        </div>
      </div>
    );
  }
}
