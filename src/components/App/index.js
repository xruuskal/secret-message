// src/components/App/index.js

import React, { Component } from 'react';
import logo from './chestnuts-151927_640.png';
import src from './3663c24c-c5db-11e6-8be5-e358d0e0215a.png';
import './styles.css';
import Canvas from '../Canvas'

class App extends Component {
  constructor() {
    super();
    this.state = {
      width: 180,
      height: 60
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Secret message</h2>
        </div>
        <div className="App-canvas">
          <Canvas width={this.state.width} height={this.state.height} src={src} />
        </div>
      </div>
    );
  }
}

export default App;
