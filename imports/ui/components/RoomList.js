import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../api/Rooms.js';
import { ChatContext } from '../pages/App.js';

import Banned from '../modals/Banned.js';

import './RoomList.css';

export default class RoomList extends React.Component {
  constructor(props) {
    super(props);

    this.roomListEntriesRef = React.createRef();
    this.roomListArrowRef = React.createRef();
    this.bannedModalRef = React.createRef();

    this.state = {
      visible: false,
      selectedRoom: 'CROSSROADS',
    }

    this.compareRooms = this.compareRooms.bind(this);
    this.currentRoom = this.currentRoom.bind(this);
    this.isBannedFrom = this.isBannedFrom.bind(this);
  }

  componentWillMount() {
    if (!this.props.rooms) {
      return;
    }
    this.props.rooms.sort(this.compareRooms);
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.rooms) {
      return;
    }
    nextProps.rooms.sort(this.compareRooms);
  }

  compareRooms(roomA, roomB) {
    if (roomA.name === 'CROSSROADS') {
      return -1;
    }
    if (roomB.name === 'CROSSROADS') {
      return 1;
    }
    if (roomA.sfw && !roomB.sfw) {
      return -1;
    }
    if (roomB.sfw && !roomA.sfw) {
      return 1;
    }
    if ((roomA.sfw && roomB.sfw) || (!roomA.sfw && !roomB.sfw)) {
      if (roomA.characters.length > roomB.characters.length) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  }

  currentRoom() {
    let roomName;
    if (!this.props.user.profile.selectedCharacter) {
      roomName = 'CROSSROADS';
    } else {
      this.props.rooms.forEach((room) => {
        if (room._id === this.props.user.profile.selectedCharacter.room) {
          roomName = room.name;
        }
      });
    }
    return roomName;
  }

  selectRoom(room) {
    this.setState({
      selectedRoom: room.name,
    });
    this.props.selectRoom(room);
    this.displayRoomList();
  }

  enterRoom(room) {
    if (this.isBannedFrom(room)) {
      this.displayRoomList();
      this.bannedModalRef.current.show(room.name);
      return;
    }
    Meteor.call('rooms.leave', null);
    Meteor.call('rooms.enter', room);
    this.displayRoomList();
  }

  isBannedFrom(room) {
    let banned = false;
    room.banlist.forEach((bannedChar) => {
      if (bannedChar === this.props.user.profile.selectedCharacter.nickname) {
        banned = true;
      }
    });
    return banned;
  }

  createRoomEntry(room) {
    return (
      <div className={this.roomEntryCssClass(room)} key={room._id}>
        {this.props.selectRoom ? (
          <span className="roomName" onClick={this.selectRoom.bind(this, room)}>{room.name}</span>
        ) : this.props.monitor ? (
          <Link to={`/admin/monitor?room=${encodeURI(room.name)}`}><span className="roomName">{room.name}</span></Link>
        ) : (
          <span className="roomName" onClick={this.enterRoom.bind(this, room)}>{room.name}</span>
        )
        }
        {room.locked && this.roomLockJSX(room)}
        <div className="characterCount">
          <span>({room.characters.length})</span>
          <img src={this.roomEntryArrowSrc(room)} onClick={this.displayPreview.bind(this)} />
        </div>
        <div className="roomPreview" style={this.roomPreviewCssStyle(room)}>
          {room.preview.slice(0, 50)}
        </div>
        <hr />
      </div>
    );
  }

  displayRoomList() {
    if (this.props.join && (!this.props.user || !this.props.user.profile.selectedCharacter)) {
      return;
    }
    if (this.state.visible) {
      this.roomListEntriesRef.current.style.display = 'none';
      this.roomListArrowRef.current.src = '/icons/downarrow.png';
      this.state.visible = false;
    } else {
      this.roomListEntriesRef.current.style.display = 'block';
      this.roomListArrowRef.current.src = '/icons/uparrow.png';
      this.state.visible = true;
    }
  }

  displayPreview(event) {
    let target = event.target;
    let previewNode = target.parentNode.nextSibling;
    if (previewNode.style.display === 'none') {
      previewNode.style.display = 'block';
      target.src = '/icons/uparrow.png';
    } else {
      previewNode.style.display = 'none';
      target.src = '/icons/downarrow.png';
    }
  }

  roomEntryCssClass(room) {
    let sfw = room.sfw ? 'sfw' : 'nsfw';
    return 'roomEntry '+sfw;
  }

  roomEntryArrowSrc(room) {
    let src = room.name === 'CROSSROADS' ? "/icons/uparrow.png" : "/icons/downarrow.png";
    return src;
  }

  roomPreviewCssStyle(room) {
    let style = room.name === 'CROSSROADS' ? { display: 'block' } : { display: 'none' };
    return style;
  }

  roomLockJSX(room) {
    if (room.sfw) {
      return (
        <img src="/icons/lock.png" />
      );
    } else {
      return (
        <img src="/icons/redlock.png" />
      );
    }
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({user, rooms}) => (
          <div className={this.props.join ? 'roomList' : 'roomList roomListLogin'}>
            {this.props.join ? user ? (
              <span>{this.props.monitor ? this.props.currentRoom : this.currentRoom()}</span>
            ) : (
              <span>CROSSROADS</span>
            ) : (
              <span>{this.state.selectedRoom}</span>
            )
            }
            <div className="roomCount">
              <span>({this.props.monitor ? (
                rooms.filter(room => room.public || (this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp)).length
              ) : (
                rooms.filter(room => room.public && !room.closed).length
              )})</span>
              <img src="/icons/downarrow.png" ref={this.roomListArrowRef} onClick={this.displayRoomList.bind(this)} />
            </div>
            <div className="roomListEntries" ref={this.roomListEntriesRef}>
              {this.props.monitor ? (
                rooms.filter(room => room.public || (this.props.user.profile.selectedCharacter && this.props.user.profile.selectedCharacter.sysOp)).map((room) => this.createRoomEntry(room))
              ) : (
                rooms.filter(room => room.public && !room.closed).map((room) => this.createRoomEntry(room))
              )}
            </div>
            <Banned ref={this.bannedModalRef} />
          </div>
        )}
      </ChatContext.Consumer>
    );
  }
}
