'use strict';

const {BoundCluster} = require('zigbee-clusters');

class LevelControlBoundCluster extends BoundCluster {

  constructor({onMove, onStop}) {
    super();
    this._onMove = onMove;
    this._onStop = onStop;
  }

  move(payload) {
    if (typeof this._onMove === 'function') {
      this._onMove(payload);
    }
  }

  stop() {
    if (typeof this._onStop === 'function') {
      this._onStop();
    }
  }
}

module.exports = LevelControlBoundCluster;
