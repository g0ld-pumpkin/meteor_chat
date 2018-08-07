import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';

import './AdminPanelSidebar.css';

export default class AdminPanelSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.selectedMenu = this.selectedMenu.bind(this);
  }

  selectedMenu() {
    let url = this.props.match.url;
    if (url === '/admin/accounts' || url.indexOf('/admin/accounts/') === 0) {
      return 'accounts';
    }
    if (url === '/admin/characters' || url.indexOf('/admin/characters/') === 0) {
      return 'characters';
    }
    if (url === '/admin/backup' || url.indexOf('/admin/backup/') === 0) {
      return 'backup';
    }
    if (url === '/admin/blacklist') {
      return 'blacklist';
    }
    if (url === '/admin/monitor') {
      return 'monitor';
    }
    if (url === '/admin/dump') {
      return 'dump';
    }
  }

  render() {
    return (
      <div className="adminPanelSidebar">
        <Link to='/admin/accounts?page=1'>
          <div className={this.selectedMenu() === 'accounts' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="far fa-user fa-lg"></i>
            <span>Accounts</span>
          </div>
        </Link>
        <Link to='/admin/characters?page=1'>
          <div className={this.selectedMenu() === 'characters' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="fas fa-male fa-lg"></i>
            <span>Characters</span>
          </div>
        </Link>
        <Link to='/admin/backup?page=1'>
          <div className={this.selectedMenu() === 'backup' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="fas fa-database fa-lg"></i>
            <span>Account Backup</span>
          </div>
        </Link>
        <Link to='/admin/blacklist?page=1'>
          <div className={this.selectedMenu() === 'blacklist' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="fas fa-user-slash fa-lg"></i>
            <span>Blacklist</span>
          </div>
        </Link>
        <Link to='/admin/monitor?room=CROSSROADS'>
          <div className={this.selectedMenu() === 'monitor' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="far fa-eye fa-lg"></i>
            <span>Monitor Rooms</span>
          </div>
        </Link>
        <Link to='/admin/dump?page=1'>
          <div className={this.selectedMenu() === 'dump' ? 'adminPanelSidebarItem adminPanelSidebarItemSelected' : 'adminPanelSidebarItem'}>
            <i className="fas fa-trash-alt fa-lg"></i>
            <span>Character Dump</span>
          </div>
        </Link>
      </div>
    );
  }
}
