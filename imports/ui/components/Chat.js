import React from 'react';
import { Meteor } from 'meteor/meteor';

import ChatLine from './ChatLine.js';

import './Chat.css';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    console.log('sfdadf');

    this.chatRef = React.createRef();

    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;

    this.state = {
      selectedMessage: null,
    }

    this.selectMessage = this.selectMessage.bind(this);
    this.clearSelectedMessage = this.clearSelectedMessage.bind(this);
    this.mentionsInView = this.mentionsInView.bind(this);
    this.shouldIgnoreMessage = this.shouldIgnoreMessage.bind(this);
    this.dragMouseDown = this.dragMouseDown.bind(this);
    this.dragChat = this.dragChat.bind(this);
    this.closeDragChat = this.closeDragChat.bind(this);
  }

  componentDidMount() {
    this.chatRef.current.addEventListener('scroll', this.mentionsInView);
    this.chatRef.current.scrollTop = this.chatRef.current.scrollHeight;
    this.mentionsInView();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.chatRef.current.scrollTop = this.chatRef.current.scrollHeight;
    }
    this.mentionsInView();
  }

  dragMouseDown(event) {
    if (this.props.private) {
      event.preventDefault();
      this.pos3 = event.clientX;
      this.pos4 = event.clientY;
      document.onmouseup = this.closeDragChat;
      document.onmousemove = this.dragChat;
    }
  }

  dragChat(event) {
    event.preventDefault();
    this.pos1 = this.pos3 - event.clientX;
    this.pos2 = this.pos4 - event.clientY;
    this.pos3 = event.clientX;
    this.pos4 = event.clientY;
    this.props.privateMessageChat.style.top = (this.props.privateMessageChat.offsetTop - this.pos2) + "px";
    this.props.privateMessageChat.style.left = (this.props.privateMessageChat.offsetLeft - this.pos1) + "px";
  }

  closeDragChat() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  mentionsInView() {
    if (this.props.mentions.length === 0) {
      return;
    }
    let chatMessages = this.chatRef.current.childNodes;
    let chatRect = this.chatRef.current.getBoundingClientRect();
    let chatTop = chatRect.top, chatHeight = chatRect.height;
    let i, j;
    let chatMessageRect, chatMessageTop, chatMessageBottom;
    for (i = 0; i < chatMessages.length; i++) {
      chatMessageRect = chatMessages[i].getBoundingClientRect();
      chatMessageTop = chatMessageRect.top, chatMessageBottom = chatMessageRect.bottom;
      if (chatMessageTop >= chatTop && chatMessageTop < chatTop+chatHeight && chatMessageBottom > chatTop && chatMessageBottom < chatTop+chatHeight) {
        for (j = 0; j < this.props.mentions.length; j++) {
          if (this.props.mentions[j].messageId === chatMessages[i].getAttribute('messageid')) {
            Meteor.call('account.deleteNotification', this.props.mentions[j]);
          }
        }
      }
    }
  }

  selectMessage(message) {
    this.setState({
      selectedMessage: message,
    });
  }

  clearSelectedMessage() {
    this.setState({
      selectedMessage: null,
    });
  }

  createChatLineEntry(message) {
    return (
      <ChatLine private={this.props.private} message={message} key={JSON.stringify(message.createdAt)} selectedMessage={this.state.selectedMessage} selectMessage={this.selectMessage} clearSelectedMessage={this.clearSelectedMessage} />
    );
  }

  shouldIgnoreMessage(message) {
    if (!this.props.user || !this.props.user.profile.selectedCharacter || !this.props.user.profile.selectedCharacter.ignoreList || !message.character) {
      return false;
    }
    let shouldIgnore = false;
    this.props.user.profile.selectedCharacter.ignoreList.forEach((ignored) => {
      if (ignored === message.character._id) {
        shouldIgnore = true;
      }
    });
    return shouldIgnore;
  }

  render() {
    return (
      <div className={this.props.private ? 'chat privateChat' : 'chat'} style={this.props.emptyHeader ? { height: 'calc(100vh - 225px)' } : { height: 'calc(100vh - 285px)' }} onMouseDown={this.dragMouseDown} ref={this.chatRef}>
        {this.props.messages.filter(message => { return !message.deleted && !this.shouldIgnoreMessage(message) }).map((message) => this.createChatLineEntry(message))}
      </div>
    );
  }
}
