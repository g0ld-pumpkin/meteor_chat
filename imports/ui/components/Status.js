import React from 'react';
import { Meteor } from 'meteor/meteor';

import './Status.css';

export default class Status extends React.Component {
  constructor(props) {
    super(props);

    this.statusIconColor = this.statusIconColor.bind(this);
    this.statusIconClass = this.statusIconClass.bind(this);
  }

  statusIconClass() {
    if (this.props.profile) {
      return 'fas fa-circle fa-xs characterListEntryStatus profileStatus';
    } else if (this.props.searchSidebar) {
      return 'fas fa-circle fa-xs characterListEntryStatus searchSidebarStatus';
    } else {
      return 'fas fa-circle fa-xs characterListEntryStatus characterSidebarStatus';
    }
  }

  statusIconColor() {
    let color = this.props.status === 'online' ? { color: 'green' } : this.props.status === 'idle' ? { color: 'yellow' } : { color: 'red' };
    return color;
  }

  statusIconTitle() {
    let title = this.props.status === 'online' ? 'Online' : this.props.status === 'idle' ? 'Idle' : 'Offline';
    return title;
  }

  render() {
    return (
      <i className={this.statusIconClass()} style={this.statusIconColor()} title={this.statusIconTitle()}></i>
    );
  }
}
