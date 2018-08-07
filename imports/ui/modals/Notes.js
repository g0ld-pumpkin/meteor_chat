import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random';

import './Notes.css';

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: props.notes,
      newNote: false,
    };

    this.notesRef = React.createRef();
    this.notesContainerRef = React.createRef();

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.canEdit = this.canEdit.bind(this);
    this.noteContainerStyle = this.noteContainerStyle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.state.notes = nextProps.notes;
  }

  componentDidUpdate() {
    if (this.state.newNote) {
      this.notesContainerRef.current.firstChild.nextSibling.firstChild.nextSibling.focus();
      this.state.newNote = false;
    }
  }

  show() {
    this.notesRef.current.style.display = 'block';
  }

  hide(event) {
    if (event) {
      event.preventDefault();
    }
    this.notesRef.current.style.display = 'none';
  }

  saveNotes() {
    Meteor.call('account.updateNotes', this.props.accountName, this.state.notes);
    this.hide();
  }

  addNote() {
    let note = {
      _id: Random.id(),
      text: '',
      character: this.props.user.profile.selectedCharacter,
      lastEdit: new Date(),
    }
    this.state.notes.unshift(note);
    this.setState({
      notes: this.state.notes,
      newNote: true,
    });
  }

  editNote(noteId, event) {
    this.state.notes.forEach((note, index) => {
      if (note._id === noteId) {
        this.state.notes[index].text = event.target.innerText;
        this.state.notes[index].lastEdit = new Date();
      }
    });
  }

  deleteNote(noteId, event) {
    this.state.notes.forEach((note, index) => {
      if (note._id === noteId) {
        this.state.notes.splice(index, 1);
      }
    });
    this.setState(this.state);
  }

  canEdit(note) {
    if (!this.props.user || !this.props.user.profile.selectedCharacter) {
      return;
    }
    if (this.props.user.profile.selectedCharacter.sysOp) {
      return true;
    }
    if (this.props.user.profile.selectedCharacter._id === note.character._id) {
      return true;
    }
    return false;
  }

  noteContainerStyle(note) {
    if (this.canEdit(note)) {
      return {
        display: 'block',
      }
    } else {
      return {
        display: 'none',
      }
    }
  }

  createNoteEntry(note) {
    return (
      <div className='noteContainer' key={note._id}>
        {note.lastEdit && <p className='noteHeader'>Last edited by {note.character.nickname} on {note.lastEdit.toUTCString()}</p>}
        <p className='note' contentEditable={this.canEdit(note)} onInput={this.editNote.bind(this, note._id)}>{note.text}</p>
        <div className='noteActionContainer' style={this.noteContainerStyle(note)}>
          <i className="fas fa-trash-alt" style={{marginLeft: '8px'}} onClick={this.deleteNote.bind(this, note._id)} title='Delete note'></i>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="modal" ref={this.notesRef}>
        <div className="modalContent" style={{margin: '5% auto'}}>
          <div className="modalTitleBox">
            <span className="close" onClick={this.hide}>&times;</span>
            <h4>NOTES</h4>
          </div>
          <hr />
          <div className="formBox">
            <div ref={this.notesContainerRef} className='notesContainer'>
              <div className='addNoteContainer'><i className="fas fa-plus-circle fa-2x" style={{color: 'blue'}} onClick={this.addNote}></i></div>
              {this.state.notes && this.state.notes.map((note) => this.createNoteEntry(note))}
            </div>
            <button className="flatBlueButton" style={{width: '60px', marginRight: '10px'}} onClick={this.saveNotes}>SAVE</button>
            <button className="flatBlueButton" style={{width: '60px', border: '1px solid #3198db', background: '#111111'}} onClick={this.hide}>CANCEL</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {

  return {
    user: Meteor.user(),
  };
})(Notes);
