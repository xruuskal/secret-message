// src/components/Canvas/index.js

import React, { Component } from 'react';

class Canvas extends Component {
  constructor() {
    super();
    this.state = {
      messagePixels: [],
      allPixels: []
    }
    this.initCanvas = this.initCanvas.bind(this);
    this.loopImagePixels = this.loopImagePixels.bind(this);
    this.startDrawing = this.startDrawing.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.isSameColor = this.isSameColor.bind(this);
    this.removeRandomNonMsgPixels = this.removeRandomNonMsgPixels.bind(this);
    this.sleep = this.sleep.bind(this);
  }

  componentDidMount() {
    this.initCanvas();
  }

  // Draw canvas based on secret message image in order to get rgb values
  initCanvas() {
    const { src } = this.props;
    const c = this.refs.canvas;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      this.loopImagePixels(ctx);
    }
    img.src = src;
  }

  // Get pixels that make up the message
  loopImagePixels(ctx) {
    const { width, height } = this.props;
    let [x, y] = [0, 0];
    for (; x+y <= width + height;) {
      const canvasData = ctx.getImageData(x, y, 1, 1);
      const pixelColor = { r: canvasData.data[0], g: canvasData.data[1], b: canvasData.data[2] };
      this.state.allPixels.push(x+'.'+y);
      this.startDrawing(pixelColor, x, y, ctx);
      x++;
      if (x > 180) {
        y++;
        x = 0;
      }
    }
    this.removeRandomNonMsgPixels(ctx);
  }

  // Check for pixels telling us to start drawing
  startDrawing(pixelColor, x, y, ctx) {
      const { drawUp, drawLeft } = this.props;
      if (this.isSameColor(drawUp, pixelColor)) {
        this.drawLine('up', x, y, ctx);
      }
      else if (this.isSameColor(drawLeft, pixelColor)) {
        this.drawLine('left', x, y, ctx);
      }
  }

  /*
  Instead of using canvas stroke to draw the message immediately,
  let's save the pixels for the message in order to do something cool later
  */
  drawLine(direction, x, y, ctx) {
    const { stopDrawing, turnRight, turnLeft } = this.props;
    this.state.messagePixels.push(x+'.'+y);
    if (direction === 'up') {
      y--;
    }
    else if (direction === 'right') {
      x++;
    }
    else if (direction === 'left') {
      x--;
    }
    else if (direction === 'down') {
      y++;
    }
    else {
      console.error('No valid direction for drawing');
      return;
    }
    const nextPixelData = ctx.getImageData(x, y, 1, 1);
    const nextPixel = { r: nextPixelData.data[0], g: nextPixelData.data[1], b: nextPixelData.data[2] }
    if (this.isSameColor(stopDrawing, nextPixel)) {
      // We're done with this line
      return;
    }
    else if (this.isSameColor(turnRight, nextPixel)) {
      this.drawLine(this.props[direction]['right'], x, y, ctx);
    }
    else if (this.isSameColor(turnLeft, nextPixel)) {
      this.drawLine(this.props[direction]['left'], x, y, ctx);
    }
    else {
      this.drawLine(direction, x, y, ctx);
    }
  }

  isSameColor(pixel1, pixel2) {
    return pixel1.r === pixel2.r && pixel1.g === pixel2.g && pixel1.b === pixel2.b;
  }

  // Remove pixels randomly until only the message is left
  async removeRandomNonMsgPixels(ctx) {
    const pixels = this.state.allPixels.filter(function(el) {
      return this.state.messagePixels.indexOf(el) === -1;
    }, this);
    const arrayLen = pixels.length;
    let timeout = 50;
    ctx.fillStyle = 'white';
    for (let i = 0; i < arrayLen; i++) {
      this.sleep(timeout + i).then(() => {
        const rnd = parseInt((Math.random() * pixels.length) - 1, 10);
        const coords = pixels[rnd].split('.');
        ctx.fillRect(coords[0], coords[1], 1, 1);
        pixels.splice(rnd, 1);
      });
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref='canvas' width={width} height={height}>Is this 1998?</canvas>
    );
  }
}

export default Canvas;

Canvas.defaultProps = {
  drawUp: { r: 7, g: 84, b: 19 },
  drawLeft: { r: 139, g: 57, b: 137 },
  stopDrawing: { r: 51, g: 69, b: 169 },
  turnRight: { r: 182, g: 149, b: 72 },
  turnLeft: { r: 123, g: 131, b: 154 },
  up: { left: 'left', right: 'right' },
  left: { left: 'down', right: 'up' },
  right: { left: 'up', right: 'down' },
  down: { left: 'right', right: 'left' }
}
