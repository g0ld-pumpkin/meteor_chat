import React from 'react';
import { Meteor } from 'meteor/meteor';

import ChatInput from './ChatInput.js';
import Emojis from './Emojis.js';
import ChatFormat from './ChatFormat.js';
import Dice from './Dice.js';

import './ChatEdit.css';

export default class ChatEdit extends React.Component {
  constructor(props) {
    super(props);

    this.chatInputRef = React.createRef();
    this.diceRef = React.createRef();
    this.chatFormatRef = React.createRef();

    this.mentionUser = this.mentionUser.bind(this);
    this.disbandEmojisAndDice = this.disbandEmojisAndDice.bind(this);
    this.disbandEmojisAndFormat = this.disbandEmojisAndFormat.bind(this);
    this.disbandDiceAndFormat = this.disbandDiceAndFormat.bind(this);
  }

  mentionUser(user) {
    this.chatInputRef.current.mentionUser(user);
  }

  disbandEmojisAndDice() {
    this.chatInputRef.current.getEmojisRef().hideEmojis();
    this.diceRef.current.hideDices();
  }

  disbandEmojisAndFormat() {
    this.chatInputRef.current.getEmojisRef().hideEmojis();
    this.chatFormatRef.current.getColorPickerRef().hideColorPicker();
    this.chatFormatRef.current.disbandFontAndHeader();
  }

  disbandDiceAndFormat() {
    this.diceRef.current.hideDices();
    this.chatFormatRef.current.disbandFontAndHeader();
    this.chatFormatRef.current.getColorPickerRef().hideColorPicker();
  }

  render() {
    return (
      <div className='chatEdit'>
        <ChatInput disbandWidgets={this.disbandDiceAndFormat} private={this.props.private} character={this.props.character} room={this.props.room} user={this.props.user} ref={this.chatInputRef} />
        <ChatFormat disbandWidgets={this.disbandEmojisAndDice} character={this.props.character} ref={this.chatFormatRef} />
        <Dice disbandWidgets={this.disbandEmojisAndFormat} character={this.props.character} room={this.props.room} ref={this.diceRef} />
      </div>
    );
  }
}
