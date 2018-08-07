import React from 'react';
import { Meteor } from 'meteor/meteor';

import InsertCode from '../modals/InsertCode.js';

import './ProfileEdit.css';

export default class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);

    this.fontDropdownContentRef = React.createRef();
    this.headerDropdownContentRef = React.createRef();
    this.listDropdownContentRef = React.createRef();
    this.colorInputRef = React.createRef();
    this.bgColorInputRef = React.createRef();
    this.profileEditRef = React.createRef();
    this.profileImageInputRef = React.createRef();
    this.imageUrlInputRef = React.createRef();
    this.profileLinkInputRef = React.createRef();
    this.linkUrlInputRef = React.createRef();
    this.insertCodeModalRef = React.createRef();

    this.selection = null;

    this.saveSelection = this.saveSelection.bind(this);
    this.restoreSelection = this.restoreSelection.bind(this);
    this.displayFonts = this.displayFonts.bind(this);
    this.displayHeaders = this.displayHeaders.bind(this);
    this.displayLists = this.displayLists.bind(this);
    this.displayImageInput = this.displayImageInput.bind(this);
    this.displayLinkInput = this.displayLinkInput.bind(this);
    this.displayCodeInput = this.displayCodeInput.bind(this);
    this.fontFamily = this.fontFamily.bind(this);
    this.formatBlock = this.formatBlock.bind(this);
    this.bold = this.bold.bind(this);
    this.italic = this.italic.bind(this);
    this.underline = this.underline.bind(this);
    this.foreColor = this.foreColor.bind(this);
    this.bgColor = this.bgColor.bind(this);
    this.alignLeft = this.alignLeft.bind(this);
    this.alignCenter = this.alignCenter.bind(this);
    this.alignRight = this.alignRight.bind(this);
    this.image = this.image.bind(this);
    this.link = this.link.bind(this);
    this.insertCode = this.insertCode.bind(this);
    this.getProfileHTML = this.getProfileHTML.bind(this);
    this.setProfileHTML = this.setProfileHTML.bind(this);
    this.clear = this.clear.bind(this);
  }

  displayFonts(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.fontDropdownContentRef.current.style.display === 'block') {
      this.fontDropdownContentRef.current.style.display = 'none';
    } else {
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
      this.headerDropdownContentRef.current.style.display = 'block';
    }
  }

  displayLists(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.listDropdownContentRef.current.style.display === 'block') {
      this.listDropdownContentRef.current.style.display = 'none';
    } else {
      this.listDropdownContentRef.current.style.display = 'block';
    }
  }

  displayImageInput(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.profileImageInputRef.current.style.display === 'block') {
      this.profileImageInputRef.current.style.display = 'none';
    } else {
      this.profileImageInputRef.current.style.display = 'block';
    }
  }

  displayLinkInput(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.profileLinkInputRef.current.style.display === 'block') {
      this.profileLinkInputRef.current.style.display = 'none';
    } else {
      this.profileLinkInputRef.current.style.display = 'block';
    }
  }

  displayCodeInput(event) {
    if (event) {
      event.preventDefault();
    }
    this.insertCodeModalRef.current.show();
  }

  fontFamily(font, event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("fontName", false, font);
    this.displayFonts();
  }

  formatBlock(tag, event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("formatBlock", false, tag);
    this.displayHeaders();
  }

  bold(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("bold");
  }

  italic(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("italic");
  }

  underline(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("underline");
  }

  foreColor(event) {
    event.preventDefault();
    this.profileEditRef.current.focus();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("foreColor", false, this.colorInputRef.current.value);
  }

  bgColor(event) {
    event.preventDefault();
    this.profileEditRef.current.focus();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("backColor", false, this.bgColorInputRef.current.value);
  }

  alignLeft(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("justifyLeft");
  }

  alignCenter(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("justifyCenter");
  }

  alignRight(event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    document.execCommand("justifyRight");
  }

  list(type, event) {
    event.preventDefault();
    if (document.activeElement !== this.profileEditRef.current) {
      return;
    }
    if (type === 'ordered') {
      document.execCommand("insertOrderedList");
    } else if (type === 'unordered') {
      document.execCommand("insertUnorderedList");
    }
  }

  image(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      let imageUrl = this.imageUrlInputRef.current.value;
      this.displayImageInput();
      this.imageUrlInputRef.current.value = '';
      this.restoreSelection();
      document.execCommand("insertImage", false, imageUrl);
    }
  }

  link(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      let linkUrl = this.linkUrlInputRef.current.value;
      this.displayLinkInput();
      this.linkUrlInputRef.current.value = '';
      this.restoreSelection();
      document.execCommand("createLink", false, linkUrl);
    }
  }

  saveSelection() {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        this.selection = sel.getRangeAt(0);
      }
    } else if (document.selection && document.selection.createRange) {
      this.selection = document.selection.createRange();
    }
  }

  restoreSelection() {
    if (this.selection) {
      if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.selection);
      } else if (document.selection && this.selection.select) {
        this.selection.select();
      }
    }
  }

  insertCode(code) {
    this.profileEditRef.current.focus();
    document.execCommand("insertHTML", false, code);
  }

  getProfileHTML() {
    return this.profileEditRef.current.innerHTML;
  }

  setProfileHTML(profileHTML) {
    this.profileEditRef.current.innerHTML = profileHTML;
  }

  clear() {
    this.profileEditRef.current.innerHTML = '';
  }

  render() {
    return (
      <div className='profileEditContainer'>
        <div className='profileFormat'>
          <div className='formattingSection formattingDropdown'>
            <div className='formattingDropdownButton' onMouseDown={this.displayFonts}>
              Arial
              <i className="fas fa-caret-down"></i>
            </div>
            <div className="profileFontDropdownChoice" ref={this.fontDropdownContentRef}>
              <div className="profileFontChoice" style={{fontFamily: 'Arial'}} onMouseDown={this.fontFamily.bind(this, 'Arial')}>Arial</div>
              <div className="profileFontChoice" style={{fontFamily: 'Helvetica'}} onMouseDown={this.fontFamily.bind(this, 'Helvetica')}>Helvetica</div>
              <div className="profileFontChoice" style={{fontFamily: 'Times New Roman'}} onMouseDown={this.fontFamily.bind(this, 'Times New Roman')}>Times New Roman</div>
              <div className="profileFontChoice" style={{fontFamily: 'Times'}} onMouseDown={this.fontFamily.bind(this, 'Times')}>Times</div>
              <div className="profileFontChoice" style={{fontFamily: 'Courier New'}} onMouseDown={this.fontFamily.bind(this, 'Courier New')}>Courier New</div>
              <div className="profileFontChoice" style={{fontFamily: 'Courier'}} onMouseDown={this.fontFamily.bind(this, 'Courier')}>Courier</div>
              <div className="profileFontChoice" style={{fontFamily: 'Verdana'}} onMouseDown={this.fontFamily.bind(this, 'Verdana')}>Verdana</div>
              <div className="profileFontChoice" style={{fontFamily: 'Georgia'}} onMouseDown={this.fontFamily.bind(this, 'Georgia')}>Georgia</div>
              <div className="profileFontChoice" style={{fontFamily: 'Palatino'}} onMouseDown={this.fontFamily.bind(this, 'Palatino')}>Palatino</div>
              <div className="profileFontChoice" style={{fontFamily: 'Garamond'}} onMouseDown={this.fontFamily.bind(this, 'Garamond')}>Garamond</div>
              <div className="profileFontChoice" style={{fontFamily: 'Bookman'}} onMouseDown={this.fontFamily.bind(this, 'Bookman')}>Bookman</div>
              <div className="profileFontChoice" style={{fontFamily: 'Comic Sans MS'}} onMouseDown={this.fontFamily.bind(this, 'Comic Sans MS')}>Comic Sans MS</div>
              <div className="profileFontChoice" style={{fontFamily: 'Trebuchet MS'}} onMouseDown={this.fontFamily.bind(this, 'Trebuchet MS')}>Trebuchet MS</div>
              <div className="profileFontChoice" style={{fontFamily: 'Arial Black'}} onMouseDown={this.fontFamily.bind(this, 'Arial Black')}>Arial Black</div>
              <div className="profileFontChoice" style={{fontFamily: 'Impact'}} onMouseDown={this.fontFamily.bind(this, 'Impact')}>Impact</div>
            </div>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection formattingDropdown'>
            <div className='formattingDropdownButton' onMouseDown={this.displayHeaders}>
              H4
              <i className="fas fa-caret-down"></i>
            </div>
            <div className="profileHeaderDropdownChoice" ref={this.headerDropdownContentRef}>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'p')}>Paragraph</div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h1')}><h1>H1</h1></div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h2')}><h2>H2</h2></div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h3')}><h3>H3</h3></div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h4')}><h4>H4</h4></div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h5')}><h5>H5</h5></div>
              <div className="profileHeaderChoice" onMouseDown={this.formatBlock.bind(this, 'h6')}><h6>H6</h6></div>
            </div>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection'>
            <i className="fas fa-bold" onMouseDown={this.bold}></i>
            <i className="fas fa-italic" onMouseDown={this.italic}></i>
            <i className="fas fa-underline" onMouseDown={this.underline}></i>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection'>
            <input type="color" className='colorPicker' defaultValue='#ff0000' onInput={this.foreColor} ref={this.colorInputRef} />
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection'>
            <i className="fas fa-align-left" onMouseDown={this.alignLeft}></i>
            <i className="fas fa-align-center" onMouseDown={this.alignCenter}></i>
            <i className="fas fa-align-right" onMouseDown={this.alignRight}></i>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection formattingDropdown'>
            <div className='formattingDropdownButton' onMouseDown={this.displayLists}>
              <i className="fas fa-list-ul"></i>
              <i className="fas fa-caret-down"></i>
            </div>
            <div className="profileListDropdownChoice" ref={this.listDropdownContentRef}>
              <div className="profileListChoice" onMouseDown={this.list.bind(this, 'ordered')}><i className="fas fa-list-ol fa-lg"></i></div>
              <div className="profileListChoice" onMouseDown={this.list.bind(this, 'unordered')}><i className="fas fa-list-ul fa-lg"></i></div>
            </div>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection formattingDropdown'>
            <i className="fas fa-images" onMouseDown={this.displayImageInput}></i>
            <div className='profileImageInputContainer' ref={this.profileImageInputRef}>
              <div className='profileInputTitle'></div>
              <input className='profileEditInput' type='text' placeholder='Image URL' onFocus={this.saveSelection} onKeyDown={this.image} ref={this.imageUrlInputRef} />
            </div>
            <i className="fas fa-link" onMouseDown={this.displayLinkInput}></i>
            <div className='profileLinkInputContainer' ref={this.profileLinkInputRef}>
              <div className='profileInputTitle'></div>
              <input className='profileEditInput' type='text' placeholder='Link URL' onFocus={this.saveSelection} onKeyDown={this.link} ref={this.linkUrlInputRef} />
            </div>
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection formattingDropdownButton' onClick={this.displayCodeInput}>
            <i className="fas fa-code"></i>
            Source
          </div>
          <div className="formattingSectionSeparator"></div>
          <div className='formattingSection'>
            <span style={{color: '#88979e', marginRight: '10px'}}>bg</span>
            <input type="color" className='colorPicker' defaultValue='#111111' onInput={this.bgColor} ref={this.bgColorInputRef} />
          </div>
        </div>
        <p className='profileEdit' contentEditable='true' ref={this.profileEditRef}></p>
        <InsertCode insertCode={this.insertCode} ref={this.insertCodeModalRef} />
      </div>
    );
  }
}
