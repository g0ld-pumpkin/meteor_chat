import React from 'react';
import { Meteor } from 'meteor/meteor';

import './ColorPicker.css';

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    this.colorPickerRef = React.createRef();
    this.pickerPreviewRef = React.createRef();
    this.okButtonRef = React.createRef();

    this.showColorPicker = this.showColorPicker.bind(this);
    this.hideColorPicker = this.hideColorPicker.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.updatePreviewColor = this.updatePreviewColor.bind(this);
    this.selectColor = this.selectColor.bind(this);
  }

  componentDidMount() {
    let canvas = document.getElementById('picker');
    let ctx = canvas.getContext('2d');
    var colorwheelImg = new Image();
    colorwheelImg.onload = function() {
      ctx.drawImage(colorwheelImg, 0, 0, colorwheelImg.width, colorwheelImg.height);
    }
    colorwheelImg.src = '/icons/colors.png';
  }

  updateColor(event) {
    let canvas = document.getElementById('picker');
    let canvasRect = canvas.getBoundingClientRect();
    let ctx = canvas.getContext('2d');
    let canvasOffsetLeft = canvasRect.left;
    let canvasOffsetTop = canvasRect.top;
    let canvasX = Math.floor(event.clientX - canvasOffsetLeft);
    let canvasY = Math.floor(event.clientY - canvasOffsetTop);
    let imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    let pixel = imageData.data;
    let pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
    this.pickerPreviewRef.current.style.backgroundColor = pixelColor;
    this.rVal.value = pixel[0];
    this.gVal.value = pixel[1];
    this.bVal.value = pixel[2];
    let dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
    this.hexVal.value = '#' + ('0000' + dColor.toString(16)).substr(-6);
  }

  updatePreviewColor() {
    this.pickerPreviewRef.current.style.backgroundColor = this.hexVal.value;
  }

  showColorPicker() {
    if (this.colorPickerRef.current.style.display === 'block') {
      this.colorPickerRef.current.style.display = 'none';
    } else {
      this.props.disbandWidgets();
      this.props.disbandFontAndHeader();
      this.colorPickerRef.current.style.display = 'block';
    }
  }

  hideColorPicker() {
    this.colorPickerRef.current.style.display = 'none';
  }

  selectColor(event) {
    this.hideColorPicker();
    Meteor.call('account.updateTextColor', this.hexVal.value);
  }

  render() {
    return (
      <div className='colorPicker'>
        <div className='colorPickerImg' style={{backgroundColor: this.props.color}} onClick={this.showColorPicker}></div>
        <div className='colorPickerContainer' ref={this.colorPickerRef}>
          <canvas id='picker' width='150px' height='150px' onMouseMove={this.updateColor} onClick={this.selectColor}></canvas>
          <div className='pickerControls'>
            <div><label>R</label><input type="text" className='formInput' ref={(input) => this.rVal = input} disabled /></div>
            <div><label>G</label><input type="text" className='formInput' ref={(input) => this.gVal = input} disabled /></div>
            <div><label>B</label><input type="text" className='formInput' ref={(input) => this.bVal = input} disabled /></div>
            <div><label>HEX</label><input type="text" className='formInput' ref={(input) => this.hexVal = input} onInput={this.updatePreviewColor} /></div>
          </div>
          <div style={{marginBottom: '15px'}}></div>
          <div style={{marginLeft: '15px'}} className='pickerPreview' ref={this.pickerPreviewRef}></div>
          <button style={{marginLeft: '185px', marginBottom: '25px', display: 'inline-block', width: '80px'}} className='flatBlueButton' onClick={this.selectColor} ref={this.okButtonRef}>OK</button>
        </div>
      </div>
    );
  }
}
