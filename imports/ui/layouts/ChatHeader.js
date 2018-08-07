import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Route } from 'react-router';

import RoomDescription from '../components/RoomDescription.js';
import CreateRoom from '../modals/CreateRoom.js';
import RoomList from '../components/RoomList.js';

import './ChatHeader.css';

class ChatHeader extends React.Component {
  constructor(props) {
    super(props);

    this.createRoomRef = React.createRef();

    this.createRoom = this.createRoom.bind(this);
    this.closeRoom = this.closeRoom.bind(this);
  }

  createRoom() {
    if (!this.props.user || !this.props.user.profile.selectedCharacter) {
      return;
    }
    this.createRoomRef.current.show();
  }

  closeRoom() {
    Meteor.call('rooms.delete', this.props.activeRoom._id);
  }

  render() {
    return (
      <div id="chatHeader">
        <img src="/icons/logo.jpg" className='logoImg' />
        <Route exact path='/admin/monitor' render={() => (
          <>
            {!this.props.activeRoom && <Redirect to='/admin/monitor?room=CROSSROADS' />}
            {this.props.activeRoom &&
              <>
                <Link to='/'><i className="far fa-comment-alt fa-2x chatHighlight chatLink" style={{color: '#3497db'}}></i></Link>
                <RoomDescription room={this.props.activeRoom} pinnedMessages={this.props.activeRoom.messages.filter(message => message.pinned)} user={this.props.user} />
                <div id="roomListContainer">
                  <RoomList monitor={true} currentRoom={this.props.activeRoom.name} join={true} user={this.props.user} rooms={this.props.rooms} />
                  <button className="flatBlueButton" onClick={this.closeRoom} style={{verticalAlign: 'top'}}>CLOSE</button>
                </div>
              </>
            }
          </>
        )}/>
        <Route exact path='/' render={() => (
          <>
            <i className="far fa-comment-alt fa-2x chatHighlight" style={{color: '#3497db'}}></i>
            {this.props.activeRoom &&
              <RoomDescription room={this.props.activeRoom} pinnedMessages={this.props.activeRoom.messages.filter(message => message.pinned)} user={this.props.user} />
            }
            <div id="roomListContainer">
              <RoomList monitor={false} join={true} user={this.props.user} rooms={this.props.rooms} />
              <CreateRoom user={this.props.user} create={true} room={null} ref={this.createRoomRef} />
              <button className="flatBlueButton" onClick={this.createRoom} style={{verticalAlign: 'top'}}>NEW ROOM</button>
            </div>
          </>
        )}/>
        <Route exact path={['/admin', '/admin/accounts', '/admin/accounts/:accountName', '/admin/characters', '/admin/characters/:characterName', '/admin/backup', '/admin/backup/:accountName', '/admin/blacklist', '/admin/dump']} render={() => (
          <>
            <Link to='/'><i className="far fa-comment-alt fa-2x chatHighlight chatLink" style={{color: '#919191'}}></i></Link>
            <h2 className='administratorTitle'>ADMINISTRATOR PANEL</h2>
          </>
        )}/>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(ChatHeader);
