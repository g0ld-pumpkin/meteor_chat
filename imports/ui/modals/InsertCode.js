import React from 'react';
import { Meteor } from 'meteor/meteor';

import './InsertCode.css';

export default class InsertCode extends React.Component {
  constructor(props) {
    super(props);

    this.insertCodeRef = React.createRef();
    this.codeRef = React.createRef();

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.insertCode = this.insertCode.bind(this);
  }

  show() {
    this.insertCodeRef.current.style.display = 'block';
  }

  hide(event) {
    event.preventDefault();
    this.insertCodeRef.current.style.display = 'none';
  }

  insertCode(event) {
    event.preventDefault();
    this.props.insertCode(this.codeRef.current.value);
    this.codeRef.current.value = '';
    this.insertCodeRef.current.style.display = 'none';
  }

  render() {
    return (
      <div className="modal" ref={this.insertCodeRef}>
        <div className="modalContent" style={{margin: '5% auto'}}>
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>INSERT/EDIT CODE</h4>
          </div>
          <hr />
          <div className="formBox">
            <textarea ref={this.codeRef} className='codeInput'></textarea>
            <button className="flatBlueButton" style={{width: '60px', marginRight: '10px'}} onClick={this.insertCode}>OK</button>
            <button className="flatBlueButton" style={{width: '60px', border: '1px solid #3198db', background: '#111111'}} onClick={this.hide}>CANCEL</button>
          </div>
        </div>
      </div>
    );
  }
}
