import React from 'react';
import { Meteor } from 'meteor/meteor';

import './Emojis.css';

export default class Emojis extends React.Component {
  constructor(props) {
    super(props);

    this.emojiContentRef = React.createRef();
    this.emojiFacesRef = React.createRef();
    this.emojiBodyRef = React.createRef();
    this.emojiEmotionRef = React.createRef();
    this.emojiAnimalRef = React.createRef();
    this.emojiPersonRef = React.createRef();
    this.emojiPersonFantasyRef = React.createRef();
    this.emojiPersonGestureRef = React.createRef();

    this.hideEmojiCategories = this.hideEmojiCategories.bind(this);
    this.displayEmojis = this.displayEmojis.bind(this);
    this.hideEmojis = this.hideEmojis.bind(this);
  }

  componentDidMount() {
    this.emojiFacesRef.current.style.display = 'block';
  }

  hideEmojis() {
    this.emojiContentRef.current.style.display = 'none';
  }

  displayEmojis(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.emojiContentRef.current.style.display === 'block') {
      this.emojiContentRef.current.style.display = 'none';
    } else {
      this.props.disbandWidgets();
      this.emojiContentRef.current.style.display = 'block';
    }
  }

  emoji(emoji, event) {
    event.preventDefault();
    if (document.activeElement !== this.props.chatInput) {
      return;
    }
    document.execCommand("insertHTML", false, `<span class="emojiImg">${emoji}</span>`);
  }

  emojiCategorie(categorie) {
    this.hideEmojiCategories();
    if (categorie === 'faces') {
      this.emojiFacesRef.current.style.display = 'block';
    } else if (categorie === 'body') {
      this.emojiBodyRef.current.style.display = 'block';
    } else if (categorie === 'emotion') {
      this.emojiEmotionRef.current.style.display = 'block';
    } else if (categorie === 'animal') {
      this.emojiAnimalRef.current.style.display = 'block';
    } else if (categorie === 'person') {
      this.emojiPersonRef.current.style.display = 'block';
    } else if (categorie === 'personFantasy') {
      this.emojiPersonFantasyRef.current.style.display = 'block';
    } else if (categorie === 'personGesture') {
      this.emojiPersonGestureRef.current.style.display = 'block';
    }
  }

  hideEmojiCategories() {
    this.emojiFacesRef.current.style.display = 'none';
    this.emojiBodyRef.current.style.display = 'none';
    this.emojiEmotionRef.current.style.display = 'none';
    this.emojiAnimalRef.current.style.display = 'none';
    this.emojiPersonRef.current.style.display = 'none';
    this.emojiPersonFantasyRef.current.style.display = 'none';
    this.emojiPersonGestureRef.current.style.display = 'none';
  }

  render() {
    return (
      <>
        <i className="far fa-smile fa-2x emojiIcon" style={{color: 'grey'}} onMouseDown={this.displayEmojis}></i>
        <div className="emojiContainer" ref={this.emojiContentRef}>
          <div className="emojiTab" ref={this.emojiFacesRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👍')}>👍</span>
              <span onMouseDown={this.emoji.bind(this, '👎')}>👎</span>
              <span onMouseDown={this.emoji.bind(this, '😀')}>😀</span>
              <span onMouseDown={this.emoji.bind(this, '😁')}>😁</span>
              <span onMouseDown={this.emoji.bind(this, '😂')}>😂</span>
              <span onMouseDown={this.emoji.bind(this, '😃')}>😃</span>
              <span onMouseDown={this.emoji.bind(this, '😉')}>😉</span>
              <span onMouseDown={this.emoji.bind(this, '😎')}>😎</span>
              <span onMouseDown={this.emoji.bind(this, '🙂')}>🙂</span>
              <span onMouseDown={this.emoji.bind(this, '😊')}>😊</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '😐')}>😐</span>
              <span onMouseDown={this.emoji.bind(this, '😕')}>😕</span>
              <span onMouseDown={this.emoji.bind(this, '😢')}>😢</span>
              <span onMouseDown={this.emoji.bind(this, '😿')}>😿</span>
              <span onMouseDown={this.emoji.bind(this, '😞')}>😞</span>
              <span onMouseDown={this.emoji.bind(this, '😥')}>😥</span>
              <span onMouseDown={this.emoji.bind(this, '😵')}>😵</span>
              <span onMouseDown={this.emoji.bind(this, '😔')}>😔</span>
              <span onMouseDown={this.emoji.bind(this, '😭')}>😭</span>
              <span onMouseDown={this.emoji.bind(this, '😤')}>😤</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '😖')}>😖</span>
              <span onMouseDown={this.emoji.bind(this, '😨')}>😨</span>
              <span onMouseDown={this.emoji.bind(this, '😩')}>😩</span>
              <span onMouseDown={this.emoji.bind(this, '😬')}>😬</span>
              <span onMouseDown={this.emoji.bind(this, '😰')}>😰</span>
              <span onMouseDown={this.emoji.bind(this, '😱')}>😱</span>
              <span onMouseDown={this.emoji.bind(this, '😳')}>😳</span>
              <span onMouseDown={this.emoji.bind(this, '😜')}>😜</span>
              <span onMouseDown={this.emoji.bind(this, '😵')}>😵</span>
              <span onMouseDown={this.emoji.bind(this, '😡')}>😡</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🤗')}>🤗</span>
              <span onMouseDown={this.emoji.bind(this, '😗')}>😗</span>
              <span onMouseDown={this.emoji.bind(this, '😽')}>😽</span>
              <span onMouseDown={this.emoji.bind(this, '😚')}>😚</span>
              <span onMouseDown={this.emoji.bind(this, '😘')}>😘</span>
              <span onMouseDown={this.emoji.bind(this, '😙')}>😙</span>
              <span onMouseDown={this.emoji.bind(this, '🤓')}>🤓</span>
              <span onMouseDown={this.emoji.bind(this, '😎')}>😎</span>
              <span onMouseDown={this.emoji.bind(this, '🙂')}>🙂</span>
              <span onMouseDown={this.emoji.bind(this, '🙃')}>🙃</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '😈')}>😈</span>
              <span onMouseDown={this.emoji.bind(this, '👿')}>👿</span>
              <span onMouseDown={this.emoji.bind(this, '👹')}>👹</span>
              <span onMouseDown={this.emoji.bind(this, '👺')}>👺</span>
              <span onMouseDown={this.emoji.bind(this, '💀')}>💀</span>
              <span onMouseDown={this.emoji.bind(this, '👻')}>👻</span>
              <span onMouseDown={this.emoji.bind(this, '👽')}>👽</span>
              <span onMouseDown={this.emoji.bind(this, '👾')}>👾</span>
              <span onMouseDown={this.emoji.bind(this, '🤖')}>🤖</span>
              <span onMouseDown={this.emoji.bind(this, '💩')}>💩</span>
            </div>
          </div>


          <div className="emojiTab" ref={this.emojiBodyRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👍')}>👍</span>
              <span onMouseDown={this.emoji.bind(this, '👎')}>👎</span>
              <span onMouseDown={this.emoji.bind(this, '💪')}>💪</span>
              <span onMouseDown={this.emoji.bind(this, '👈')}>👈</span>
              <span onMouseDown={this.emoji.bind(this, '👉')}>👉</span>
              <span onMouseDown={this.emoji.bind(this, '☝️')}>☝️</span>
              <span onMouseDown={this.emoji.bind(this, '🖕')}>🖕</span>
              <span onMouseDown={this.emoji.bind(this, '👇')}>👇</span>
              <span onMouseDown={this.emoji.bind(this, '✌️')}>✌️</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F91E')}>&#x1F91E;</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🖖')}>🖖</span>
              <span onMouseDown={this.emoji.bind(this, '🤘')}>🤘</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F919')}>&#x1F919;</span>
              <span onMouseDown={this.emoji.bind(this, '🖐️')}>🖐️</span>
              <span onMouseDown={this.emoji.bind(this, '✋')}>✋</span>
              <span onMouseDown={this.emoji.bind(this, '👌')}>👌</span>
              <span onMouseDown={this.emoji.bind(this, '&#x270A')}>&#x270A;</span>
              <span onMouseDown={this.emoji.bind(this, '👊')}>👊</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F91B')}>&#x1F91B;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F91C')}>&#x1F91C;</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '&#x1F91A')}>&#x1F91A;</span>
              <span onMouseDown={this.emoji.bind(this, '👋')}>👋</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F44F')}>&#x1F44F;</span>
              <span onMouseDown={this.emoji.bind(this, '✍️')}>✍️</span>
              <span onMouseDown={this.emoji.bind(this, '👏')}>👏</span>
              <span onMouseDown={this.emoji.bind(this, '👐')}>👐</span>
              <span onMouseDown={this.emoji.bind(this, '✋')}>✋</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F932')}>&#x1F932;</span>
              <span onMouseDown={this.emoji.bind(this, '🙏')}>🙏</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F91D')}>&#x1F91D;</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '💅')}>💅</span>
              <span onMouseDown={this.emoji.bind(this, '👂')}>👂</span>
              <span onMouseDown={this.emoji.bind(this, '👃')}>👃</span>
              <span onMouseDown={this.emoji.bind(this, '👣')}>👣</span>
              <span onMouseDown={this.emoji.bind(this, '👀')}>👀</span>
              <span onMouseDown={this.emoji.bind(this, '👁️')}>👁️</span>
              <span onMouseDown={this.emoji.bind(this, '👁️‍🗨️')}>👁️‍🗨️</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9E0')}>&#x1F9E0;</span>
              <span onMouseDown={this.emoji.bind(this, '👅')}>👅</span>
              <span onMouseDown={this.emoji.bind(this, '👄')}>👄</span>
            </div>
            <div className="emojiRow"></div>
          </div>


          <div className="emojiTab" ref={this.emojiEmotionRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '💋')}>💋</span>
              <span onMouseDown={this.emoji.bind(this, '💘')}>💘</span>
              <span onMouseDown={this.emoji.bind(this, '💝')}>💝</span>
              <span onMouseDown={this.emoji.bind(this, '💖')}>💖</span>
              <span onMouseDown={this.emoji.bind(this, '💗')}>💗</span>
              <span onMouseDown={this.emoji.bind(this, '💓')}>💓</span>
              <span onMouseDown={this.emoji.bind(this, '💞')}>💞</span>
              <span onMouseDown={this.emoji.bind(this, '💕')}>💕</span>
              <span onMouseDown={this.emoji.bind(this, '💌')}>💌</span>
              <span onMouseDown={this.emoji.bind(this, '❣️')}>❣️</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '💔')}>💔</span>
              <span onMouseDown={this.emoji.bind(this, '❤️')}>❤️</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9E1')}>&#x1F9E1;</span>
              <span onMouseDown={this.emoji.bind(this, '💛')}>💛</span>
              <span onMouseDown={this.emoji.bind(this, '💚')}>💚</span>
              <span onMouseDown={this.emoji.bind(this, '💙')}>💙</span>
              <span onMouseDown={this.emoji.bind(this, '💜')}>💜</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F5A4')}>&#x1F5A4;</span>
              <span onMouseDown={this.emoji.bind(this, '💟')}>💟</span>
              <span onMouseDown={this.emoji.bind(this, '💤')}>💤</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '💢')}>💢</span>
              <span onMouseDown={this.emoji.bind(this, '💣')}>💣</span>
              <span onMouseDown={this.emoji.bind(this, '💥')}>💥</span>
              <span onMouseDown={this.emoji.bind(this, '💦')}>💦</span>
              <span onMouseDown={this.emoji.bind(this, '💨')}>💨</span>
              <span onMouseDown={this.emoji.bind(this, '💫')}>💫</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F4AC')}>&#x1F4AC;</span>
              <span onMouseDown={this.emoji.bind(this, '🗨️')}>🗨️</span>
              <span onMouseDown={this.emoji.bind(this, '🗯️')}>🗯️</span>
              <span onMouseDown={this.emoji.bind(this, '💭')}>💭</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🕳️')}>🕳️</span>
            </div>
            <div className="emojiRow"></div>
          </div>



          <div className="emojiTab" ref={this.emojiAnimalRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🐵')}>🐵</span>
              <span onMouseDown={this.emoji.bind(this, '🐒')}>🐒</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F98D')}>&#x1F98D;</span>
              <span onMouseDown={this.emoji.bind(this, '🐶')}>🐶</span>
              <span onMouseDown={this.emoji.bind(this, '🐕')}>🐕</span>
              <span onMouseDown={this.emoji.bind(this, '🐩')}>🐩</span>
              <span onMouseDown={this.emoji.bind(this, '🐺')}>🐺</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F98A')}>&#x1F98A;</span>
              <span onMouseDown={this.emoji.bind(this, '🐈')}>🐈</span>
              <span onMouseDown={this.emoji.bind(this, '🐱')}>🐱</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🦁')}>🦁</span>
              <span onMouseDown={this.emoji.bind(this, '🐯')}>🐯</span>
              <span onMouseDown={this.emoji.bind(this, '🐅')}>🐅</span>
              <span onMouseDown={this.emoji.bind(this, '🐆')}>🐆</span>
              <span onMouseDown={this.emoji.bind(this, '🐴')}>🐴</span>
              <span onMouseDown={this.emoji.bind(this, '🐎')}>🐎</span>
              <span onMouseDown={this.emoji.bind(this, '🦄')}>🦄</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F98C')}>&#x1F98C;</span>
              <span onMouseDown={this.emoji.bind(this, '🐮')}>🐮</span>
              <span onMouseDown={this.emoji.bind(this, '🐂')}>🐂</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🐷')}>🐷</span>
              <span onMouseDown={this.emoji.bind(this, '🐐')}>🐐</span>
              <span onMouseDown={this.emoji.bind(this, '🐪')}>🐪</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F992')}>&#x1F992;</span>
              <span onMouseDown={this.emoji.bind(this, '🐘')}>🐘</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F98F')}>&#x1F98F;</span>
              <span onMouseDown={this.emoji.bind(this, '🐭')}>🐭</span>
              <span onMouseDown={this.emoji.bind(this, '🐰️')}>🐰️</span>
              <span onMouseDown={this.emoji.bind(this, '🐿️')}>🐿️️</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F994')}>&#x1F994;</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '&#x1F987')}>&#x1F987;</span>
              <span onMouseDown={this.emoji.bind(this, '🐻')}>🐻</span>
              <span onMouseDown={this.emoji.bind(this, '🐨')}>🐨</span>
              <span onMouseDown={this.emoji.bind(this, '🐼')}>🐼</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F43C')}>&#x1F43C;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F985')}>&#x1F985;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F986')}>&#x1F986;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F989')}>&#x1F989;</span>
              <span onMouseDown={this.emoji.bind(this, '🐸')}>🐸️️</span>
              <span onMouseDown={this.emoji.bind(this, '🐊')}>🐊</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🐢')}>🐢</span>
              <span onMouseDown={this.emoji.bind(this, '🐍')}>🐍</span>
              <span onMouseDown={this.emoji.bind(this, '🐉')}>🐉</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F996')}>&#x1F996;</span>
              <span onMouseDown={this.emoji.bind(this, '🐳')}>🐳</span>
              <span onMouseDown={this.emoji.bind(this, '🐬')}>🐬</span>
              <span onMouseDown={this.emoji.bind(this, '🐠')}>🐠</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F988')}>&#x1F988;</span>
              <span onMouseDown={this.emoji.bind(this, '🐙')}>🐙️️</span>
              <span onMouseDown={this.emoji.bind(this, '🦀')}>🦀</span>
            </div>
          </div>


          <div className="emojiTab" ref={this.emojiPersonRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👶')}>👶</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9D2')}>&#x1F9D2;</span>
              <span onMouseDown={this.emoji.bind(this, '👦')}>👦</span>
              <span onMouseDown={this.emoji.bind(this, '👧')}>👧</span>
              <span onMouseDown={this.emoji.bind(this, '🙍')}>🙍</span>
              <span onMouseDown={this.emoji.bind(this, '👱')}>👱</span>
              <span onMouseDown={this.emoji.bind(this, '👨')}>👨</span>
              <span onMouseDown={this.emoji.bind(this, '👱')}>👱</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9D4')}>&#x1F9D4;</span>
              <span onMouseDown={this.emoji.bind(this, '👩')}>👩</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👱‍♀️')}>👱‍♀️</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9D3')}>&#x1F9D3;</span>
              <span onMouseDown={this.emoji.bind(this, '👴')}>👴</span>
              <span onMouseDown={this.emoji.bind(this, '👵')}>👵</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍⚕️')}>👨‍⚕️</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍⚕️')}>👩‍⚕️</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🎓')}>👨‍🎓</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🎓')}>👩‍🎓</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🏫')}>👨‍🏫</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🏫')}>👩‍🏫</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👨‍⚖️')}>👨‍⚖️</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍⚖️')}>👩‍⚖️</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🌾')}>👨‍🌾</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🌾')}>👩‍🌾</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🍳')}>👨‍🍳</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🍳')}>👩‍🍳</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🔧')}>👨‍🔧</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🔧')}>👩‍🔧️</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🏭')}>👨‍🏭️️</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🏭')}>👩‍🏭</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👨‍💼')}>👨‍💼</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍💼')}>👩‍💼</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🔬')}>👨‍🔬</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🔬')}>👩‍🔬</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍💻')}>👨‍💻</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍💻')}>👩‍💻</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🎤')}>👨‍🎤</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🎤')}>👩‍🎤</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🎨')}>👨‍🎨️️</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🎨')}>👩‍🎨</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '👨‍✈️')}>👨‍✈️</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍✈️')}>👩‍✈️</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🚀')}>👨‍🚀</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🚀')}>👩‍🚀</span>
              <span onMouseDown={this.emoji.bind(this, '👨‍🚒')}>👨‍🚒</span>
              <span onMouseDown={this.emoji.bind(this, '👩‍🚒')}>👩‍🚒</span>
              <span onMouseDown={this.emoji.bind(this, '👮')}>👮</span>
              <span onMouseDown={this.emoji.bind(this, '👮‍♀️')}>👮‍♀️</span>
              <span onMouseDown={this.emoji.bind(this, '🕵️‍♀️')}>🕵️‍♀️</span>
              <span onMouseDown={this.emoji.bind(this, '👷')}>👷</span>
            </div>
          </div>


          <div className="emojiTab" ref={this.emojiPersonFantasyRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '&#x1F934')}>&#x1F934;</span>
              <span onMouseDown={this.emoji.bind(this, '👸')}>👸</span>
              <span onMouseDown={this.emoji.bind(this, '👳')}>👳</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9D5')}>&#x1F9D5;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F935')}>&#x1F935;</span>
              <span onMouseDown={this.emoji.bind(this, '👼')}>👼</span>
              <span onMouseDown={this.emoji.bind(this, '🎅')}>🎅</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9B8')}>&#x1F9DA;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F9B9')}>&#x1F9DB;</span>
            </div>
            <div className="emojiRow"></div>
            <div className="emojiRow"></div>
            <div className="emojiRow"></div>
            <div className="emojiRow"></div>
          </div>


          <div className="emojiTab" ref={this.emojiPersonGestureRef}>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🙍')}>🙍</span>
              <span onMouseDown={this.emoji.bind(this, '🙎')}>🙎</span>
              <span onMouseDown={this.emoji.bind(this, '🙆')}>🙆</span>
              <span onMouseDown={this.emoji.bind(this, '🙆')}>🙆</span>
              <span onMouseDown={this.emoji.bind(this, '💁')}>💁</span>
              <span onMouseDown={this.emoji.bind(this, '🙋')}>🙋</span>
              <span onMouseDown={this.emoji.bind(this, '🙇')}>🙇</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F926')}>&#x1F926;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F937')}>&#x1F937;</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F485')}>&#x1F486;</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '💆')}>💆</span>
              <span onMouseDown={this.emoji.bind(this, '💇')}>💇</span>
              <span onMouseDown={this.emoji.bind(this, '🚶')}>🚶</span>
              <span onMouseDown={this.emoji.bind(this, '🏃')}>🏃</span>
              <span onMouseDown={this.emoji.bind(this, '💃')}>💃</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F57A')}>&#x1F57A;</span>
              <span onMouseDown={this.emoji.bind(this, '👯')}>👯</span>
              <span onMouseDown={this.emoji.bind(this, '🛀')}>🛀</span>
              <span onMouseDown={this.emoji.bind(this, '🛌')}>🛌</span>
              <span onMouseDown={this.emoji.bind(this, '🕴️')}>🕴️</span>
            </div>
            <div className="emojiRow" style={{marginTop: '-30px', marginBottom: '30px'}}>
              <span onMouseDown={this.emoji.bind(this, '🗣️')}>🗣️</span>
              <span onMouseDown={this.emoji.bind(this, '👥')}>👥</span>
              <span onMouseDown={this.emoji.bind(this, '👥')}>👥</span>
              <span onMouseDown={this.emoji.bind(this, '&#x1F93A')}>&#x1F93A;</span>
              <span onMouseDown={this.emoji.bind(this, '🏇')}>🏇</span>
              <span onMouseDown={this.emoji.bind(this, '⛷️')}>⛷️</span>
              <span onMouseDown={this.emoji.bind(this, '🏂')}>🏂</span>
              <span onMouseDown={this.emoji.bind(this, '🏌️')}>️🏌️</span>
              <span onMouseDown={this.emoji.bind(this, '🏄')}>️🏄️</span>
              <span onMouseDown={this.emoji.bind(this, '🚣')}>🚣</span>
            </div>
            <div className="emojiRow">
              <span onMouseDown={this.emoji.bind(this, '🏊')}>🏊</span>
              <span onMouseDown={this.emoji.bind(this, '⛹️')}>⛹️</span>
              <span onMouseDown={this.emoji.bind(this, '🏋️')}>🏋️</span>
              <span onMouseDown={this.emoji.bind(this, '🚴')}>🚴</span>
              <span onMouseDown={this.emoji.bind(this, '🚵')}>🚵</span>
              <span onMouseDown={this.emoji.bind(this, '🏎️')}>🏎️</span>
              <span onMouseDown={this.emoji.bind(this, '🏍️')}>🏍️</span>
            </div>
            <div className="emojiRow"></div>
          </div>

          <hr />
          <div className="emojiRow emojiCategories">
            <span onMouseDown={this.emojiCategorie.bind(this, 'faces')}>😀</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'body')}>👍</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'emotion')}>❤️</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'animal')}>🐵</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'person')}>👶</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'personFantasy')}>&#x1F934;</span>
            <span onMouseDown={this.emojiCategorie.bind(this, 'personGesture')}>🙍</span>
          </div>
        </div>
      </>
    );
  }
}
