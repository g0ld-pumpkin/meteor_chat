import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Notes from '../../modals/Notes.js';

import './Blacklist.css';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Blacklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
      pagingIndex: 0,
    }

    this.searchAccount = this.searchAccount.bind(this);
    this.filterAccount = this.filterAccount.bind(this);
    this.pageLinkStyle = this.pageLinkStyle.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  unbanAccount(accountId) {
    Meteor.call('account.unban', accountId);
  }

  searchAccount() {
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

  displayNotes(event) {
    event.target.nextSibling.style.display = 'block';
  }

  createAccountEntry(account) {
    return (
      <tr key={account._id}>
        <td>{account.profile.number}</td>
        <td>{account.username}</td>
        <td>{account.profile.createdAt.toUTCString()}</td>
        <td>{account.profile.dateBanned.toUTCString()}</td>
        <td>{account.emails[0].address}</td>
        <td>{account.profile.characters.length}</td>
        <td>{this.accountRoles(account).join(' ')}</td>
        <td>{account.profile.refferals}</td>
        <td>
          <i className="far fa-sticky-note noteIcon" onClick={this.displayNotes}></i>
          <Notes notes={account.profile.notes} accountName={account.username} />
        </td>
        <td>
          {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp &&
            <i className="fas fa-trash-alt deleteAccountIcon accountActions" title="Unban Account" style={{marginLeft: '8px'}} onClick={this.unbanAccount.bind(this, account._id)}></i>
          }
        </td>
      </tr>
    );
  }

  filterAccount(account) {
    if (!this.state.search) {
      return true;
    }
    let searchFilter = this.searchFilter.value;
    if (account.username.indexOf(searchFilter) === 0) {
      return true;
    }
    if (account.emails[0].address.indexOf(searchFilter) === 0) {
      return true;
    }
    if (account.ipAddress && account.ipAddress.indexOf(searchFilter) === 0) {
      return true;
    }
    return false;
  }

  accountRoles(account) {
    let roles = [];
    account.profile.characters.forEach((character) => {
      if (character.sysOp) {
        roles.push('SysOp');
      }
      if (character.admin) {
        roles.push('Admin');
      }
      if (character.globalModerator) {
        roles.push('GM');
      }
      if (!character.sysOp && !character.admin && !character.globalModerator) {
        roles.push('User');
      }
    });
    return _.uniq(roles);
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
    if (this.state.pagingIndex === Math.floor(this.props.numberOfAccounts/75)) {
      return;
    }
    this.setState({
      pagingIndex: this.state.pagingIndex+1
    });
  }

  render() {
    let c = Math.ceil(this.props.numberOfAccounts/15);
    let pageLinks = [];
    let i = 1;
    while (i <= c) {
      pageLinks.push(<Link to={`/admin/blacklist?page=${i}`} key={i}><span className='pageLinks' style={this.pageLinkStyle(i)}>{i}</span></Link>);
      i++;
    }

    return (
      <div className="accounts">
        <input className='adminPanelSearchInput' type='text' placeholder='Search Account' ref={(input) => this.searchFilter = input} /><button className='flatBlueButton' style={{width: '120px'}} onClick={this.searchAccount}><i className="fas fa-search fa-lg" style={{marginRight: '10px'}}></i>SEARCH</button>
        <div style={{marginBottom: '20px'}}></div>
        <table className='accountsTable'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Acc. Created</th>
              <th>Date Banned</th>
              <th>Email</th>
              <th>Characters</th>
              <th>Roles</th>
              <th>Refferals</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.accounts.filter(account => this.filterAccount(account)).map((account) => this.createAccountEntry(account))}
          </tbody>
        </table>
        <div className='accountsPaging'>
          <span className='pageLinksNav' onClick={this.previous} style={this.state.pagingIndex === 0 ? { display: 'none' } : { display: 'inline-block'}}>Previous</span>
          {pageLinks}
          <span className='pageLinksNav' onClick={this.next} style={this.state.pagingIndex === Math.floor(this.props.numberOfAccounts/75) ? { display: 'none' } : { display: 'inline-block'}}>Next</span>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('account.all');
  let page = getParameterByName('page');

  return {
    page: parseInt(page),
    numberOfAccounts: Meteor.users.find({ 'profile.banned': true }).count(),
    accounts: Meteor.users.find({ 'profile.banned': true }, {skip: 15*(parseInt(page)-1), limit: 15, sort: { 'profile.dateBanned': 1}}).fetch(),
    user: Meteor.user(),
  };
})(Blacklist);
