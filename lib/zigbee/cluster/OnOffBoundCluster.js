'use strict';

const { BoundCluster } = require('zigbee-clusters');

module.exports = class OnOffBoundCluster extends BoundCluster {

  constructor({onSetOff, onSetOn, onToggle}) {
    super();
    this._onToggle = onToggle;
    this._onSetOff = onSetOff;
    this._onSetOn = onSetOn;
  }

  toggle() {
    if (typeof this._onToggle === 'function') {
      this._onToggle();
    }
  }

  setOn() {
    if (typeof this._onSetOn === 'function') {
      this._onSetOn();
    }
  }

  setOff() {
    if (typeof this._onSetOff === 'function') {
      this._onSetOff();
    }
  }

}
