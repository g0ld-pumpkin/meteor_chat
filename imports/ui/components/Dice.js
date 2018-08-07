import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import './Dice.css';

export default class Dice extends React.Component {
  constructor(props) {
    super(props);

    this.dicesRef = React.createRef();
    this.diceIconRef = React.createRef();

    this.eightBallMessages = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - Definitely.', 'You may rely on it.',
                              'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
                              'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
                              "Don't count on it.", 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];

    this.showDices = this.showDices.bind(this);
    this.hideDices = this.hideDices.bind(this);
    this.d3 = this.d3.bind(this);
    this.d4 = this.d4.bind(this);
    this.d6 = this.d6.bind(this);
    this.d10 = this.d10.bind(this);
    this.d12 = this.d12.bind(this);
    this.d20 = this.d20.bind(this);
    this.d30 = this.d30.bind(this);
    this.d100 = this.d100.bind(this);
    this.d666 = this.d666.bind(this);
    this.spin = this.spin.bind(this);
    this.pass = this.pass.bind(this);
    this.eightBall = this.eightBall.bind(this);
    this.truthOrDare = this.truthOrDare.bind(this);
    this.postDiceMessage = this.postDiceMessage.bind(this);
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

  d3() {
    let roll = Math.floor((Math.random() * 3) + 1);
    let message = `(${this.props.character.nickname} rolls 1d3 => ${roll})`;
    this.postDiceMessage(message);
  }

  d4() {
    let roll = Math.floor((Math.random() * 4) + 1);
    let message = `(${this.props.character.nickname} rolls 1d4 => ${roll})`;
    this.postDiceMessage(message);
  }

  d6() {
    let roll = Math.floor((Math.random() * 6) + 1);
    let message = `(${this.props.character.nickname} rolls 1d6 => ${roll})`;
    this.postDiceMessage(message);
  }

  d10() {
    let roll = Math.floor((Math.random() * 10) + 1);
    let message = `(${this.props.character.nickname} rolls 1d10 => ${roll})`;
    this.postDiceMessage(message);
  }

  d12() {
    let roll = Math.floor((Math.random() * 12) + 1);
    let message = `(${this.props.character.nickname} rolls 1d12 => ${roll})`;
    this.postDiceMessage(message);
  }

  d20() {
    let roll = Math.floor((Math.random() * 20) + 1);
    let message = `(${this.props.character.nickname} rolls 1d20 => ${roll})`;
    this.postDiceMessage(message);
  }

  d30() {
    let roll = Math.floor((Math.random() * 30) + 1);
    let message = `(${this.props.character.nickname} rolls 1d30 => ${roll})`;
    this.postDiceMessage(message);
  }

  d100() {
    let roll = Math.floor((Math.random() * 100) + 1);
    let message = `(${this.props.character.nickname} rolls 1d100 => ${roll})`;
    this.postDiceMessage(message);
  }

  d666() {
    let roll = Math.floor((Math.random() * 666) + 1);
    let message = `(${this.props.character.nickname} rolls a d666 => ${roll})`;
    this.postDiceMessage(message);
  }

  spin() {
    let roll = Math.floor((Math.random() * this.props.room.characters.length) + 1);
    let character = this.props.room.characters[roll-1];
    let message = `(${this.props.character.nickname} spins the bottle => ${character.nickname})`;
    this.postDiceMessage(message);
  }

  pass() {
    let roll = Math.floor((Math.random() * 2) + 1);
    let pass = roll === 1 ? 'PASS' : 'FAIL';
    let message = `(${this.props.character.nickname} rolls PASS/FAIL => ${pass})`;
    this.postDiceMessage(message);
  }

  eightBall() {
    let roll = Math.floor((Math.random() * 20) + 1);
    let eightBallMessage = this.eightBallMessages[roll-1];
    let message = `(${this.props.character.nickname} is asking the 8BALL => ${eightBallMessage})`;
    this.postDiceMessage(message);
  }

  truthOrDare() {
    let roll = Math.floor((Math.random() * 2) + 1);
    let td = roll === 1 ? 'TRUTH' : 'DARE';
    let message = `(${this.props.character.nickname} is playing TRUTH or DARE => ${td})`;
    this.postDiceMessage(message);
  }

  showDices() {
    if (this.dicesRef.current.style.display === 'inline-block') {
      this.dicesRef.current.style.display = 'none';
    } else {
      this.props.disbandWidgets();
      this.dicesRef.current.style.display = 'inline-block';
    }
  }

  hideDices() {
    this.dicesRef.current.style.display = 'none';
  }

  render() {
    return (
      <div className='chatDiceContainer'>
        <i className="fas fa-dice fa-2x diceImage" style={{color: '#88979e'}} onClick={this.showDices} ref={this.diceIconRef}></i>
        <div className='dices' ref={this.dicesRef}>
          <div className='dice' onClick={this.d3}>d3</div>
          <div className='dice' onClick={this.d4}>d4</div>
          <div className='dice' onClick={this.d6}>d6</div>
          <div className='dice' onClick={this.d10}>d10</div>
          <div className='dice' onClick={this.d12}>d12</div>
          <div className='dice' onClick={this.d20}>d20</div>
          <div className='dice' onClick={this.d30}>d30</div>
          <div className='dice' onClick={this.d100}>d100</div>
          <div className='dice' onClick={this.d666}>666</div>
          <div className='dice' onClick={this.spin}>B</div>
          <div className='dice' onClick={this.pass}>PASS</div>
          <div className='dice' onClick={this.eightBall}>8BALL</div>
          <div className='dice' onClick={this.truthOrDare}>TD</div>
        </div>
      </div>
    );
  }
}
