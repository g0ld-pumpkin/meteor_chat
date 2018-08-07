import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Backup } from '../../../api/Accounts.js';

import Notes from '../../modals/Notes.js';

import './Accounts.css';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Accounts extends React.Component {
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

  deleteAccount(accountId) {
    if (this.props.backup) {
      Meteor.call('account.backup.remove', accountId);
    } else {
      Meteor.call('account.remove', accountId);
    }
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
        <td>{account.profile.ipAddress}</td>
        <td>{account.profile.createdAt.toDateString()}</td>
        <td>{account.emails[0].address}</td>
        <td>{account.profile.characters.length}</td>
        <td>{this.accountRoles(account).join(' ')}</td>
        <td>{account.profile.refferals}</td>
        <td>
          <i className="far fa-sticky-note noteIcon" onClick={this.displayNotes}></i>
          <Notes notes={account.profile.notes} accountName={account.username} />
        </td>
        <td>
          <Link to={this.props.backup ? `/admin/backup/${account.username}` : `/admin/accounts/${account.username}`}><i className="far fa-eye accountActions" title="View Account"></i></Link>
          {this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp &&
            <>
              <Link to={this.props.backup ? `/admin/backup/${account.username}` : `/admin/accounts/${account.username}`}><i className="fas fa-pencil-alt accountActions" title="Edit Account" style={{marginLeft: '8px'}}></i></Link>
              <i className="fas fa-trash-alt deleteAccountIcon accountActions" title="Delete Account" style={{marginLeft: '8px'}} onClick={this.deleteAccount.bind(this, account._id)}></i>
            </>
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
      pageLinks.push(<Link to={`/admin/accounts?page=${i}`} key={i}><span className='pageLinks' style={this.pageLinkStyle(i)}>{i}</span></Link>);
      i++;
    }
    console.log(this.props.backup);
    return (
      <div className="accounts">
        <input className='adminPanelSearchInput' type='text' placeholder='Search Account' ref={(input) => this.searchFilter = input} /><button className='flatBlueButton' style={{width: '120px'}} onClick={this.searchAccount}><i className="fas fa-search fa-lg" style={{marginRight: '10px'}}></i>SEARCH</button>
        <div style={{marginBottom: '20px'}}></div>
        <table className='accountsTable'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Ip Address</th>
              <th>Acc. Created</th>
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

export default withTracker(({ backup }) => {
  Meteor.subscribe('account.all');
  Meteor.subscribe('account.backup.all');
  let page = getParameterByName('page');

  return {
    page: parseInt(page),
    numberOfAccounts: backup ? Backup.find({}).count() : Meteor.users.find({}).count(),
    accounts: backup ? Backup.find({}, {skip: 15*(parseInt(page)-1), limit: 15, sort: { 'profile.number': 1}}).fetch() : Meteor.users.find({}, {skip: 15*(parseInt(page)-1), limit: 15, sort: { 'profile.number': 1}}).fetch(),
    user: Meteor.user(),
  };
})(Accounts);
