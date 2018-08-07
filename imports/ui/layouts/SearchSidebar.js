import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import  SearchSidebarList from '../components/SearchSidebarList.js';

import './SearchSidebar.css';

class SearchSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.searchInputRef = React.createRef();
    this.searchToolRef = React.createRef();

    this.state = {
      searching: false,
    }

    this.displaySearchTool = this.displaySearchTool.bind(this);
    this.search = this.search.bind(this);
    this.filterCharacters = this.filterCharacters.bind(this);
  }

  displaySearchTool() {
    this.nameInput.value = this.searchInputRef.current.value;
    if (this.searchInputRef.current.value === '') {
      this.searchToolRef.current.style.display = 'none';
      this.setState({
        searching: false,
      });
    } else {
      this.searchToolRef.current.style.display = 'block';
      this.setState({
        searching: true,
      });
    }
  }

  search() {
    this.setState({
      searching: true,
    });
  }

  filterCharacters() {
    let characters = [];
    let tags = this.tagsInput.value.toLowerCase().split(' ');
    this.props.characters.forEach((characterAccount) => {
      characterAccount.profile.characters.forEach((character) => {
        if (this.nameInput.value === '' && this.tagsInput.value === '') {
          if (character.status === 'online' && this.onlineRadio.checked) {
            characters.push(character);
            return;
          }
        }
        let showCharacter = true;
        let nameRegEx = new RegExp("^" + this.nameInput.value, "i");
        if (this.nameInput.value !== '' && nameRegEx.test(character.nickname) === false) {
          showCharacter = false;
        }
        if (this.tagsInput.value !== '' && _.intersection(character.tags.filter(tag => tag !== '').map(tag => tag.toLowerCase()), tags).length === 0) {
          showCharacter = false;
        }
        if (character.status === 'online' && this.offlineRadio.checked) {
          showCharacter = false;
        }
        if (character.status === 'offline' && this.onlineRadio.checked) {
          showCharacter = false;
        }
        if (showCharacter) {
          characters.push(character);
        }
      });
    });
    return characters;
  }

  render() {
    return (
      <div className="searchSidebar">
        <div className="searchInputContainer">
          <input type="text" placeholder="Search Characters" className='searchInput' onInput={this.displaySearchTool} ref={this.searchInputRef} />
          <i className="fas fa-search fa-lg" style={{color: 'grey'}}></i>
        </div>
        <div className='searchTool' ref={this.searchToolRef}>
          <label htmlFor='characterName'>Name</label><br /><br />
          <input type='text' id='characterName' className='formInput' ref={(input) => this.nameInput = input} onInput={this.search} /><br /><br />
          <label htmlFor='tags'>Tags</label><br /><br />
          <input type='text' id='tags' className='formInput' ref={(input) => this.tagsInput = input} onInput={this.search} /><br /><br />
          <input type='radio' name='status' ref={(input) => this.onlineRadio = input} onInput={this.search} defaultChecked /><span style={{marginRight: '10px'}}>Online</span>
          <input type='radio' name='status' ref={(input) => this.offlineRadio = input} onInput={this.search} /><span style={{marginRight: '10px'}}>Offline</span>
          <input type='radio' name='status' ref={(input) => this.allRadio = input} onInput={this.search} />All
        </div>
        {!this.state.searching &&
          <SearchSidebarList activeRoom={this.props.activeRoom} selectedCharacter={this.props.user && this.props.user.profile.selectedCharacter} />
        }
        {this.state.searching && this.props.characters &&
          <SearchSidebarList characters={this.filterCharacters()} selectedCharacter={this.props.user && this.props.user.profile.selectedCharacter} />
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('account.characters');

  return {
    characters: Meteor.users.find({}, { fields: { 'profile.characters': 1 } }).fetch(),
  };
})(SearchSidebar);
