import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import Emojis from './Emojis.js';

import './ChatInput.css';

export default class ChatInput extends React.Component {
  constructor(props) {
    super(props);

    this.chatInputRef = React.createRef();
    this.emojisRef = React.createRef();

    this.rollDiceRegEx = /^\/roll\s\{(\d{1,2})d(\d{1,3})(\+\d{1,3}|-\d{1,3})?\}$/;
    this.rollPfRegEx = /^\/roll\spf$/;
    this.roll8ballRegEx = /^\/roll\s8ball$/;
    this.rollTdRegEx = /^\/roll\std$/;
    this.rollSpinRegEx = /^\/roll\sspinb$/;
    this.whoisRegEx = /^\/whois\s(\w{1,19})$/;
    this.kickRegEx = /^\/kick\s(\w{1,19})$/;
    this.muteRegEx = /^\/mute\s(\w{1,19})$/;
    this.banRegEx = /^\/ban\s(\w{1,19})$/;
    this.mentionRegex = /(@(\w{1,19}))/g;
    this.bracketRegex = /^:/;
    this.shiftPressed = false;

    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.postPrivateMessage = this.postPrivateMessage.bind(this);
    this.postDiceMessage = this.postDiceMessage.bind(this);
    this.customDice = this.customDice.bind(this);
    this.addMentions = this.addMentions.bind(this);
    this.mentionUser = this.mentionUser.bind(this);
    this.verifyPostLength = this.verifyPostLength.bind(this);
    this.getEmojisRef = this.getEmojisRef.bind(this);
  }

  getEmojisRef() {
    return this.emojisRef.current;
  }

  keyDownHandler(event) {
    if (event.key === 'Enter') {
      if (this.shiftPressed) {
        if (this.chatInputRef.current.innerText === '') {
          event.preventDefault();
          return;
        }
        document.execCommand("insertHTML", false, "<br />");
      } else {
        event.preventDefault();
        if (this.props.private) {
          this.postPrivateMessage();
        } else {
          this.postMessage();
        }
      }
    }
    if (event.key === 'Shift') {
      this.shiftPressed = true;
    }
  }

  keyUpHandler(event) {
    if (event.key === 'Shift') {
      this.shiftPressed = false;
    }
  }

  mentionUser(user) {
    let currentText = this.chatInputRef.current.innerHTML;
    currentText += `@${user}`;
    this.chatInputRef.current.innerHTML = currentText;
  }

  verifyPostLength() {
    if (this.chatInputRef.current.innerText.length > 2000) {
      this.chatInputRef.current.innerText = this.chatInputRef.current.innerText.substr(0, 2000);
    }
  }

  addMentions(postText, messageId) {
    let match;
    do {
      match = this.mentionRegex.exec(postText);
      if (match) {
        Meteor.call('account.addNotification', match[2], this.props.character.nickname, messageId, 'Mention');
      }
    } while (match);
  }

  customDice(nbsDices, nbsFaces, modifier) {
    let totalRoll = 0;
    let i, roll;
    for (i = 0; i < nbsDices; i++) {
      let roll = Math.floor((Math.random() * nbsFaces) + 1);
      totalRoll += roll;
    }
    let regexResult = /^(\+|-)(\d{1,3})$/.exec(modifier);
    if (regexResult[1] === '+') {
      totalRoll += parseInt(regexResult[2]);
    } else {
      totalRoll -= parseInt(regexResult[2]);
    }
    let message = `(${this.props.character.nickname} rolls ${nbsDices}d${nbsFaces}${modifier} => ${totalRoll})`;
    this.postDiceMessage(message);
  }

  postMessage() {
    let postText = this.chatInputRef.current.textContent;
    let regexResult;
    if (this.rollDiceRegEx.test(postText) === true) {
      regexResult = this.rollDiceRegEx.exec(postText);
      this.customDice(regexResult[1], regexResult[2], regexResult[3]);
      return;
    }
    if (this.rollPfRegEx.test(postText) === true) {
      this.pass();
      return;
    }
    if (this.roll8ballRegEx.test(postText) === true) {
      this.eightBall();
      return;
    }
    if (this.rollTdRegEx.test(postText) === true) {
      this.truthOrDare();
      return;
    }
    if (this.rollSpinRegEx.test(postText) === true) {
      this.spin();
      return;
    }
    if (this.whoisRegEx.test(postText) === true) {
      regexResult = this.whoisRegEx.exec(postText);
      window.open(`http://192.168.2.12/c/${regexResult[1]}`);
      this.chatInputRef.current.innerHTML = '';
      return;
    }
    if (this.kickRegEx.test(postText) === true) {
      regexResult = this.kickRegEx.exec(postText);
      Meteor.call('rooms.kickUserFromName', this.props.room, regexResult[1]);
      this.chatInputRef.current.innerHTML = '';
      return;
    }
    if (this.muteRegEx.test(postText) === true) {
      regexResult = this.muteRegEx.exec(postText);
      Meteor.call('account.ignoreCharacterFromName', regexResult[1]);
      this.chatInputRef.current.innerHTML = '';
      return;
    }
    if (this.banRegEx.test(postText) === true) {
      regexResult = this.banRegEx.exec(postText);
      Meteor.call('rooms.banUserFromName', this.props.room, regexResult[1]);
      this.chatInputRef.current.innerHTML = '';
      return;
    }
    let post = this.unescape(this.chatInputRef.current.innerHTML);
    if (post.length > 2000) {
      post = post.substring(0, 2000);
    }
    let withBrackets = this.bracketRegex.test(postText) === false;
    if (!withBrackets) {
      post = post.replace(/:/, '');
    }
    post = post.replace(this.mentionRegex, function(match) { return `<span style='color: blue'>${match}</span>` });
    let message = {
      type: 'Regular',
      character: this.props.character,
      channel: this.props.character.channel,
      text: post,
      createdAt: new Date(),
      deleted: false,
      pinned: false,
      _id: Random.id(),
      withBrackets: withBrackets,
      color: this.props.character.textColor,
    };
    Meteor.call('rooms.postMessage', this.props.room, message);
    this.addMentions(postText, message._id);
    this.chatInputRef.current.innerHTML = '';
  }

  unescape(string) {
    return String(string).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  postDiceMessage(text) {
    let message = {
      type: 'Dice',
      text: text,
      channel: this.props.character.channel,
      createdAt: new Date(),
      deleted: false,
      _id: Random.id(),
    };
    Meteor.call('rooms.postMessage', this.props.room, message);
  }

  postPrivateMessage() {
    let postText = this.chatInputRef.current.textContent;
    let post = this.unescape(this.chatInputRef.current.innerHTML);
    if (post.length > 2000) {
      post = post.substring(0, 2000);
    }
    let withBrackets = this.bracketRegex.test(postText) === false;
    if (!withBrackets) {
      post = post.replace(/:/, '');
    }
    let message = {
      type: 'Private',
      character: this.props.character.nickname,
      text: post,
      createdAt: new Date(),
      _id: Random.id(),
      withBrackets: withBrackets,
      color: this.props.character.textColor,
    };
    Meteor.call('account.postPrivateMessage', this.props.selectedTab, message);
    Meteor.call('account.addNotification', this.props.selectedTab, this.props.character.nickname, message._id, 'Private');
    this.chatInputRef.current.innerHTML = '';
  }

  render() {
    return (
      <div className={this.props.private ? 'chatInputContainer privateInputContainer' : 'chatInputContainer'}>
        <p contentEditable="true" className={this.props.private ? 'chatInput privateInput' : 'chatInput'} placeholder="Type your message ..." ref={this.chatInputRef} onInput={this.verifyPostLength}
        onKeyDown={this.keyDownHandler} onKeyUp={this.keyUpHandler} style={{color: this.props.character.textColor}}></p>
        {this.props.user && !this.props.user.profile.settings.disableEmojis && <Emojis disbandWidgets={this.props.disbandWidgets} chatInput={this.chatInputRef.current} ref={this.emojisRef} />}
        {!this.props.private &&
          <i className="fas fa-chevron-circle-right fa-2x chatInputArrow" style={{color: '#3697db'}} onClick={this.postMessage}></i>
        }
        {this.props.private &&
          <i className="fas fa-chevron-circle-right fa-2x chatInputArrow" style={{color: '#3697db'}} onClick={this.postPrivateMessage}></i>
        }
      </div>
    );
  }
}
