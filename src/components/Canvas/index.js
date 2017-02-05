// src/components/Canvas/index.js

import React, { Component } from 'react';

class Canvas extends Component {
  constructor() {
    super();
    this.initCanvas = this.initCanvas.bind(this);
  }

  componentDidMount() {
    this.initCanvas();
  }

  initCanvas() {
    const { src } = this.props;
    const c = this.refs.canvas;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = src;
  }

  render() {
    const { id, width, height } = this.props;
    return (
      <canvas ref='canvas' width={width} height={height}>Is this 1998?</canvas>
    );
  }
}

export default Canvas;
