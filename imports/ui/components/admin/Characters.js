import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import './Characters.css';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Characters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
      pagingIndex: 0,
    }

    this.searchCharacter = this.searchCharacter.bind(this);
    this.filterCharacter = this.filterCharacter.bind(this);
    this.pageLinkStyle = this.pageLinkStyle.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  deleteCharacter(character) {
    Meteor.call('account.deleteCharacter', character);
  }

  searchCharacter() {
    if (this.searchFilter.value === '') {
      this.setState({
        search: false,
      });
    } else {
      this.setState({
        search: true,
      });
    }
  }

  createCharacterEntry(character) {
    return (
      <tr key={character._id}>
        <td>{character.number}</td>
        <td>{character.nickname}</td>
        <td>{character.userAccount}</td>
        <td>
          <Link to={`/admin/characters/${character.nickname}`}><i className="far fa-eye accountActions"></i></Link>
          {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp &&
            <>
              <Link to={`/admin/characters/${character.nickname}`}><i className="fas fa-pencil-alt accountActions" style={{marginLeft: '8px'}}></i></Link>
              <i className="fas fa-trash-alt deleteAccountIcon accountActions" style={{marginLeft: '8px'}} onClick={this.deleteCharacter.bind(this, character)}></i>
            </>
          }
        </td>
      </tr>
    );
  }

  filterCharacter(character) {
    if (!this.state.search) {
      return true;
    }
    let searchFilter = this.searchFilter.value;
    let tagFilter = this.searchFilter.value.toLowerCase().split(' ');
    if (character.nickname.indexOf(searchFilter) === 0) {
      return true;
    }
    if (_.intersection(character.tags.filter(tag => tag !== '').map(tag => tag.toLowerCase()), tagFilter).length > 0) {
      return true;
    }
    return false;
  }

  pageLinkStyle(index) {
    if (index >= 5*this.state.pagingIndex+1 && index <= 5*(this.state.pagingIndex+1)) {
      return {
        color: this.props.page === index ? 'white' : 'inherit',
        display: 'inline-block',
      }
    } else {
      return {
        color: this.props.page === index ? 'white' : 'inherit',
        display: 'none',
      }
    }
  }

  previous() {
    if (this.state.pagingIndex === 0) {
      return;
    }
    this.setState({
      pagingIndex: this.state.pagingIndex-1
    });
  }

  next() {
    if (this.state.pagingIndex === Math.floor(this.props.numberOfCharacters/75)) {
      return;
    }
    this.setState({
      pagingIndex: this.state.pagingIndex+1
    });
  }

  render() {
    let c = Math.ceil(this.props.numberOfCharacters/15);
    let pageLinks = [];
    let i = 1;
    while (i <= c) {
      pageLinks.push(<Link to={`/admin/characters?page=${i}`} key={i}><span className='pageLinks' style={this.pageLinkStyle(i)}>{i}</span></Link>);
      i++;
    }
    let characters = _.sortBy(this.props.characters, 'number').slice(15*(this.props.page-1), 15*(this.props.page-1)+15);

    return (
      <div className="characters">
        <input className='adminPanelSearchInput' type='text' placeholder='Search Character' ref={(input) => this.searchFilter = input} /><button className='flatBlueButton' style={{width: '120px'}} onClick={this.searchCharacter}><i className="fas fa-search fa-lg" style={{marginRight: '10px'}}></i>SEARCH</button>
        <div style={{marginBottom: '20px'}}></div>
        <table className='accountsTable'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nickname</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.filter(character => this.filterCharacter(character)).map((character) => this.createCharacterEntry(character))}
          </tbody>
        </table>
        <div className='accountsPaging'>
          <span className='pageLinksNav' onClick={this.previous} style={this.state.pagingIndex === 0 ? { display: 'none' } : { display: 'inline-block'}}>Previous</span>
          {pageLinks}
          <span className='pageLinksNav' onClick={this.next} style={this.state.pagingIndex === Math.floor(this.props.numberOfCharacters/75) ? { display: 'none' } : { display: 'inline-block'}}>Next</span>
        </div>
      </div>
    );
  }
}

export default withTracker(({dump}) => {
  Meteor.subscribe('account.all');
  let page = getParameterByName('page');
  console.log(dump);

  return {
    page: parseInt(page),
    numberOfCharacters: _.reduce(Meteor.users.find({}).fetch().map(account => account.profile.characters.length), function(memo, num) { return memo + num; }, 0),
    characters: _.flatten(Meteor.users.find({}).fetch().map(account => {
      account.profile.characters.forEach(character => character.userAccount = account.username);
      if (dump) {
        return account.profile.characters.filter(character => {
          let lastLoginDate = character.lastLogin;
          if (!lastLoginDate) {
            return false;
          }
          return Date.now()-lastLoginDate.getTime() > 1.051*Math.pow(10, 10);
        });
      }
      return account.profile.characters;
    })),
    user: Meteor.user(),
  };
})(Characters);
