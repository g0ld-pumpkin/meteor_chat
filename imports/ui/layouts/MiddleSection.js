import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Switch, Route } from 'react-router';

import Account from '../components/admin/Account.js';
import Accounts from '../components/admin/Accounts.js';
import Character from '../components/admin/Character.js';
import Characters from '../components/admin/Characters.js';
import Blacklist from '../components/admin/Blacklist.js';
import AdminPanelSidebar from './AdminPanelSidebar.js';
import CharacterSidebar from './CharacterSidebar.js';
import ChatSection from './ChatSection.js';
import SearchSidebar from './SearchSidebar.js';
import Nsfw from '../modals/Nsfw.js';

import './MiddleSection.css';

export const MentionUserContext = React.createContext({ mentionUser: null, showPrivateMessageTab: null });

export default class MiddleSection extends React.Component {
  constructor(props) {
    super(props);

    this.chatSectionRef = React.createRef();
    this.nsfwRef = React.createRef();

    this.state = {
      showCharacterSidebar: true,
    };

    this.mentionUser = this.mentionUser.bind(this);
    this.showPrivateMessageTab = this.showPrivateMessageTab.bind(this);
    this.showCharacterSidebar = this.showCharacterSidebar.bind(this);
    this.hideCharacterSidebar = this.hideCharacterSidebar.bind(this);

    console.log(this.props.user);

  }

  showCharacterSidebar() {
    this.setState({
      showCharacterSidebar: true,
    });
  }

  hideCharacterSidebar() {
    this.setState({
      showCharacterSidebar: false,
    });
    this.props.sidebarRef.showCharacterManagmentIcon();
  }

  mentionUser(user) {
    this.chatSectionRef.current.getChatEditRef().mentionUser(user);
  }

  showPrivateMessageTab(characterName) {
    this.chatSectionRef.current.getPrivateMessageListRef().getPrivateMessageChatRef().show(characterName)
  }

  componentWillUpdate(nextProps) {
    if (!this.props.activeRoom || !this.props.user || !this.props.user.profile.settings || !nextProps.activeRoom) {
      return;
    }
    if (this.props.activeRoom.name !== nextProps.activeRoom.name && !nextProps.activeRoom.sfw && nextProps.activeRoom.creator !== this.props.user.profile.selectedCharacter._id) {
      this.nsfwRef.current.show();
    }
    if (nextProps.activeRoom.characters.length > this.props.activeRoom.characters.length && this.props.user.profile.settings.joinsActiveRoom && !this.props.user.profile.settings.muteAllSounds) {
      this.playUserJoinSound();
    }
    if (nextProps.activeRoom.messages.length > this.props.activeRoom.messages.length && this.props.user.profile.settings.sendsMessageInActiveRoom && !this.props.user.profile.settings.muteAllSounds) {
      if (!nextProps.activeRoom.messages[nextProps.activeRoom.messages.length-1].character || nextProps.activeRoom.messages[nextProps.activeRoom.messages.length-1].type === 'Whisper') {
        return;
      }
      if (nextProps.activeRoom.messages[nextProps.activeRoom.messages.length-1].character._id !== this.props.user.profile.selectedCharacter._id) {
        this.playUserSendsMessageSound();
      }
    }
  }

  playUserJoinSound() {
    let joinSound = new Audio('/sounds/definite.ogg');
    joinSound.play();
  }

  playUserSendsMessageSound() {
    let messageSound = new Audio('/sounds/graceful.ogg');
    messageSound.play();
  }

  render() {
    return (
      <div id="middleSection">
        <Nsfw ref={this.nsfwRef} />
        <Route exact path='/' render={() => (
          <>
            {this.props.user && this.state.showCharacterSidebar &&
              <CharacterSidebar hideCharacterSidebar={this.hideCharacterSidebar} />
            }
            <MentionUserContext.Provider value={{ mentionUser: this.mentionUser, showPrivateMessageTab: this.showPrivateMessageTab }}>
              <ChatSection monitor={false} activeRoom={this.props.activeRoom} user={this.props.user} userId={this.props.userId} ref={this.chatSectionRef} />
              <SearchSidebar activeRoom={this.props.activeRoom} user={this.props.user} />
            </MentionUserContext.Provider>
          </>
        )}/>
        <Route path='/admin' render={({ match }) => (
          <>
            <AdminPanelSidebar match={this.props.match} />
            <Route exact path='/admin/accounts' render={() => (
              <Accounts backup={false} />
            )}/>
            <Route exact path='/admin/accounts/:accountName' render={() => (
              <Account match={this.props.match} />
            )}/>
            <Route exact path='/admin/characters' render={() => (
              <Characters dump={false} />
            )}/>
            <Route exact path='/admin/characters/:characterName' render={() => (
              <Character match={this.props.match} />
            )}/>
            <Route exact path='/admin/backup' render={() => (
              <Accounts backup={true} />
            )}/>
            <Route exact path='/admin/backup/:accountNameBackup' render={() => (
              <Account match={this.props.match} />
            )}/>
            <Route exact path='/admin/blacklist' render={() => (
              <Blacklist match={this.props.match} />
            )}/>
            <Route exact path='/admin/monitor' render={() => (
              <MentionUserContext.Provider value={{ mentionUser: this.mentionUser, showPrivateMessageTab: this.showPrivateMessageTab }}>
                <ChatSection monitor={true} activeRoom={this.props.activeRoom} user={this.props.user} userId={this.props.userId} ref={this.chatSectionRef} />
                <SearchSidebar activeRoom={this.props.activeRoom} user={this.props.user} />
              </MentionUserContext.Provider>
            )}/>
            <Route exact path='/admin/dump' render={() => (
              <Characters dump={true} />
            )}/>
          </>
        )}/>
      </div>
    );
  }
}
