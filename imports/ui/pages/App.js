import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/Rooms.js';

import ChatHeader from '../layouts/ChatHeader.js';
import Sidebar from '../layouts/Sidebar.js';
import MiddleSection from '../layouts/MiddleSection.js';
import PrivateTab from './PrivateTab.js';

export const ChatContext = React.createContext({ user: {}, activeRoom: {} });

class App extends React.Component {
  constructor(props) {
    super(props);

    this.sidebarRef = React.createRef();
    this.middleSectionRef = React.createRef();

    this.activeRoom = this.activeRoom.bind(this);
    this.monitoredRoom = this.monitoredRoom.bind(this);

    // console.log(this.props);

  }

  componentWillUpdate(nextProps) {
    // console.log(nextProps.rooms);
  }

  activeRoom() {
    if (this.props.user && this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.room !== null) {
      return this.props.rooms.filter(room => room._id === this.props.user.profile.selectedCharacter.room);
    } else {
      return this.props.rooms.filter(room => room.name === 'CROSSROADS');
    }
  }

  monitoredRoom() {
    let roomName = decodeURI(this.props.location.search.split('=')[1]);
    return this.props.rooms.filter(room => room.name === roomName);
  }

  render() {
    return (
      <div>
        <Route exact path={['/', '/admin', '/admin/accounts', '/admin/accounts/:accountName', '/admin/characters', '/admin/characters/:characterName', '/admin/backup', '/admin/backup/:accountNameBackup', '/admin/blacklist', '/admin/dump']} render={({ match }) => (
          // <ChatContext.Provider value={{ user: this.props.user, rooms: this.props.rooms, activeRoom: this.activeRoom()[0] }}>
          <ChatContext.Provider value={{ user: this.props.user, rooms: this.props.rooms, activeRoom: this.activeRoom()[0] }}>
            <ChatHeader location={this.props.location} user={this.props.user} rooms={this.props.rooms} activeRoom={this.activeRoom()[0]} />
            <Sidebar middleSectionRef={this.middleSectionRef.current} user={this.props.user} ref={this.sidebarRef} />
            <MiddleSection sidebarRef={this.sidebarRef.current} match={match} location={this.props.location} user={this.props.user} userId={this.props.userId} activeRoom={this.activeRoom()[0]} ref={this.middleSectionRef} />
          </ChatContext.Provider>
        )}/>
        <Route exact path={['/admin/monitor']} render={({ match }) => (
          <ChatContext.Provider value={{ user: this.props.user, rooms: this.props.rooms, activeRoom: this.monitoredRoom()[0] }}>
            <ChatHeader location={this.props.location} user={this.props.user} rooms={this.props.rooms} activeRoom={this.monitoredRoom()[0]} />
            <Sidebar user={this.props.user} />
            <MiddleSection match={match} location={this.props.location} user={this.props.user} userId={this.props.userId} activeRoom={this.monitoredRoom()[0]} />
          </ChatContext.Provider>
        )}/>
        <Route exact path="/p/:characterName" render={() => (
          <ChatContext.Provider value={{ user: this.props.user, rooms: this.props.rooms, activeRoom: this.activeRoom()[0] }}>
            <PrivateTab user={this.props.user} />
          </ChatContext.Provider>
        )}/>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('rooms.list');

  return {
    userId: Meteor.userId(),
    user: Meteor.user(),
    rooms: Rooms.find().fetch(),
  };
})(App);
