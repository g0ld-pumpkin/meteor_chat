import React from 'react';
import { Meteor } from 'meteor/meteor';

import './Banned.css';

export default class Banned extends React.Component {
  constructor(props) {
    super(props);

    this.bannedModalRef = React.createRef();
    this.bannedMsgRef = React.createRef();

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(roomName) {
    this.bannedMsgRef.current.innerHTML = `You have been banned from the ${roomName}`;
    this.bannedModalRef.current.style.display = 'block';
  }

  hide() {
    this.bannedModalRef.current.style.display = 'none';
  }

  render() {
    return (
      <div className="modal bannedModal" ref={this.bannedModalRef}>
        <div className="modalContent">
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide} style={{top: '15px'}}>&times;</span>
            <i className="fas fa-exclamation-circle fa-2x" style={{color: 'red', display: 'inline-block'}}></i>
            <h4 style={{display: 'inline-block', marginLeft: '15px'}} ref={this.bannedMsgRef}></h4>
          </div>
        </div>
      </div>
    );
  }
}
