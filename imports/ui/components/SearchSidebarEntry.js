import React from 'react';
import { Meteor } from 'meteor/meteor';

import ChatAvatar from './ChatAvatar.js';
import Status from './Status.js';

import './SearchSidebarEntry.css';

export default class SearchSidebarEntry extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className={this.props.selected ? 'characterListEntry characterListEntrySelected' : 'characterListEntry'}>
        <ChatAvatar searchResult={this.props.searchResult} chat={false} character={this.props.character} />
        <Status status={this.props.character.status} searchSidebar={true} />
        <span className="characterNickname">{this.props.character.nickname}</span><br />
        <span className="characterPersonalMessage">{this.props.character.personalMessage}</span>
        {this.props.character.sysOp && <i className="fas fa-crown" title="SysOp" style={{color: 'red', right: '40px', top: '22px'}}></i>}
        {this.props.character.admin && !this.props.character.sysOp &&
           <i className="fas fa-crown" title="Admin" style={{color: 'green', right: '40px', top: '22px'}}></i>
         }
        {this.props.character.globalModerator && !this.props.character.admin && !this.props.character.sysOp &&
          <i className="fas fa-crown" title="Global Moderator" style={{color: '#add8e6', right: '40px', top: '22px'}}></i>
        }
        {this.props.moderator && !this.props.creator && !this.props.character.globalModerator && !this.props.character.admin && !this.props.character.sysOp &&
          <i className="far fa-star" title="Room Moderator" style={{color: 'grey', right: '40px', top: '22px'}}></i>
        }
        {this.props.creator && !this.props.character.globalModerator && !this.props.character.admin && !this.props.character.sysOp &&
          <i className="far fa-star" title="Room Creator" style={{color: 'grey', right: '40px', top: '22px'}}></i>
        }
      </div>
    );
  }
}
