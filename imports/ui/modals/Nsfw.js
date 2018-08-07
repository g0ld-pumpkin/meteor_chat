import React from 'react';
import { Meteor } from 'meteor/meteor';

import './Nsfw.css';

export default class Nsfw extends React.Component {
  constructor(props) {
    super(props);

    this.nsfwRef = React.createRef();

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  show() {
    this.nsfwRef.current.style.display = 'block';
  }

  hide(event) {
    event.preventDefault();
    this.nsfwRef.current.style.display = 'none';
  }

  render() {
    return (
      <div className="modal" ref={this.nsfwRef}>
        <div className="modalContent" style={{margin: '5% auto'}}>
          <div className="modalTitleBox">
            <div style={{marginBottom: '20px'}}></div>
            <div style={{margin: '0 auto 15px'}}><i className="fas fa-exclamation-triangle fa-3x" style={{color: 'red'}}></i></div>
            <div style={{marginBottom: '15px'}}>This room is NSFW and may contain explicit sexual material, violence and foul language. You must be at least 18 years old to enter this room. Are you over 18 and willing
            to see adult content?</div>
            <button className="flatBlueButton" style={{border: '1px solid #3198db', background: '#111111', width: '100px'}} onClick={this.hide}>CONTINUE</button>
            <div style={{marginBottom: '20px'}}></div>
          </div>
        </div>
      </div>
    );
  }
}
