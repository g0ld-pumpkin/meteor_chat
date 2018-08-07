import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import ColorPicker from './ColorPicker.js';

import './ChatFormat.css';

export default class ChatFormat extends React.Component {
  constructor(props) {
    super(props);

    this.fontDropdownContentRef = React.createRef();
    this.headerDropdownContentRef = React.createRef();
    this.colorInputRef = React.createRef();

    this.displayFonts = this.displayFonts.bind(this);
    this.displayHeaders = this.displayHeaders.bind(this);
    this.disbandFontAndHeader = this.disbandFontAndHeader.bind(this);
    this.getColorPickerRef = this.getColorPickerRef.bind(this);
  }

  getColorPickerRef() {
    return this.colorInputRef.current;
  }

  displayFonts(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.fontDropdownContentRef.current.style.display === 'block') {
      this.fontDropdownContentRef.current.style.display = 'none';
    } else {
      this.props.disbandWidgets();
      this.colorInputRef.current.hideColorPicker();
      this.headerDropdownContentRef.current.style.display = 'none';
      this.fontDropdownContentRef.current.style.display = 'block';
    }
  }

  displayHeaders(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.headerDropdownContentRef.current.style.display === 'block') {
      this.headerDropdownContentRef.current.style.display = 'none';
    } else {
      this.props.disbandWidgets();
      this.colorInputRef.current.hideColorPicker();
      this.fontDropdownContentRef.current.style.display = 'none';
      this.headerDropdownContentRef.current.style.display = 'block';
    }
  }

  disbandFontAndHeader() {
    this.fontDropdownContentRef.current.style.display = 'none';
    this.headerDropdownContentRef.current.style.display = 'none';
  }

  fontFamily(font, event) {
    event.preventDefault();
    document.execCommand("fontName", false, font);
    this.displayFonts();
  }

  formatBlock(tag, event) {
    event.preventDefault();
    document.execCommand("formatBlock", false, tag);
    this.displayHeaders();
  }

  bold(event) {
    event.preventDefault();
    document.execCommand("bold");
  }

  italic(event) {
    event.preventDefault();
    document.execCommand("italic");
  }

  underline(event) {
    event.preventDefault();
    document.execCommand("underline");
  }

  strikeThrough(event) {
    event.preventDefault();
    document.execCommand("strikethrough");
  }

  render() {
    return (
      <div className='chatFormattingContainer'>
        <div className='formattingSection formattingDropdown'>
          <div className='formattingDropdownButton' onMouseDown={this.displayFonts}>
            Arial
            <i className="fas fa-caret-down"></i>
          </div>
          <div className="fontDropdownChoice" ref={this.fontDropdownContentRef}>
            <div className="fontChoice" style={{fontFamily: 'Arial'}} onMouseDown={this.fontFamily.bind(this, 'Arial')}>Arial</div>
            <div className="fontChoice" style={{fontFamily: 'Helvetica'}} onMouseDown={this.fontFamily.bind(this, 'Helvetica')}>Helvetica</div>
            <div className="fontChoice" style={{fontFamily: 'Times New Roman'}} onMouseDown={this.fontFamily.bind(this, 'Times New Roman')}>Times New Roman</div>
            <div className="fontChoice" style={{fontFamily: 'Times'}} onMouseDown={this.fontFamily.bind(this, 'Times')}>Times</div>
            <div className="fontChoice" style={{fontFamily: 'Courier New'}} onMouseDown={this.fontFamily.bind(this, 'Courier New')}>Courier New</div>
            <div className="fontChoice" style={{fontFamily: 'Courier'}} onMouseDown={this.fontFamily.bind(this, 'Courier')}>Courier</div>
            <div className="fontChoice" style={{fontFamily: 'Verdana'}} onMouseDown={this.fontFamily.bind(this, 'Verdana')}>Verdana</div>
            <div className="fontChoice" style={{fontFamily: 'Georgia'}} onMouseDown={this.fontFamily.bind(this, 'Georgia')}>Georgia</div>
            <div className="fontChoice" style={{fontFamily: 'Palatino'}} onMouseDown={this.fontFamily.bind(this, 'Palatino')}>Palatino</div>
            <div className="fontChoice" style={{fontFamily: 'Garamond'}} onMouseDown={this.fontFamily.bind(this, 'Garamond')}>Garamond</div>
            <div className="fontChoice" style={{fontFamily: 'Bookman'}} onMouseDown={this.fontFamily.bind(this, 'Bookman')}>Bookman</div>
            <div className="fontChoice" style={{fontFamily: 'Comic Sans MS'}} onMouseDown={this.fontFamily.bind(this, 'Comic Sans MS')}>Comic Sans MS</div>
            <div className="fontChoice" style={{fontFamily: 'Trebuchet MS'}} onMouseDown={this.fontFamily.bind(this, 'Trebuchet MS')}>Trebuchet MS</div>
            <div className="fontChoice" style={{fontFamily: 'Arial Black'}} onMouseDown={this.fontFamily.bind(this, 'Arial Black')}>Arial Black</div>
            <div className="fontChoice" style={{fontFamily: 'Impact'}} onMouseDown={this.fontFamily.bind(this, 'Impact')}>Impact</div>
          </div>
        </div>
        <div className="formattingSectionSeparator"></div>
        <div className='formattingSection formattingDropdown'>
          <div className='formattingDropdownButton' onMouseDown={this.displayHeaders}>
            H4
            <i className="fas fa-caret-down"></i>
          </div>
          <div className="headerDropdownChoice" ref={this.headerDropdownContentRef}>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'p')}>Paragraph</div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h1')}><h1>H1</h1></div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h2')}><h2>H2</h2></div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h3')}><h3>H3</h3></div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h4')}><h4>H4</h4></div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h5')}><h5>H5</h5></div>
            <div className="headerChoice" onMouseDown={this.formatBlock.bind(this, 'h6')}><h6>H6</h6></div>
          </div>
        </div>
        <div className="formattingSectionSeparator"></div>
        <div className='formattingSection'>
          <i className="fas fa-bold" onMouseDown={this.bold}></i>
          <i className="fas fa-italic" onMouseDown={this.italic}></i>
          <i className="fas fa-underline" onMouseDown={this.underline}></i>
          <i className="fas fa-strikethrough" onMouseDown={this.strikeThrough}></i>
        </div>
        <div className="formattingSectionSeparator"></div>
        <div className='formattingSection'>
          <ColorPicker disbandFontAndHeader={this.disbandFontAndHeader} disbandWidgets={this.props.disbandWidgets} color={this.props.character.textColor} ref={this.colorInputRef} />
        </div>
    </div>
    );
  }
}
