'use strict'

const {Cluster, ZCLDataTypes} = require('zigbee-clusters');

const ATTRIBUTES = {
  operatingMode: {
    id: 0x0001,
    type: ZCLDataTypes.uint8,
    // rollerShade: 0x00, // Default
    // venetian: 0x01,
  },
  slatTiltTime: {
    id: 0x0002,
    type: ZCLDataTypes.uint16, // 0.01s resolution, default 300
  },
  slatPositionMode: {
    id: 0x0003,
    type: ZCLDataTypes.uint8,
    // noAction: 0x00,
    // returnHubOnly: 0x01,
    // returnAll: 0x02, // Default
  },
  moveTime: {
    id: 0x0004,
    type: ZCLDataTypes.uint16, // 0.01s resolution, default 6000
  },
  momentaryMovementTime: {
    id: 0x0005,
    type: ZCLDataTypes.uint16, // 1ms resolution, default 200
  },
  movementMode: {
    id: 0x0006,
    type: ZCLDataTypes.uint8,
    // momentary: 0x00,
    // continuous: 0x01, // Default
  },
  motorResponseTime: {
    id: 0x0007,
    type: ZCLDataTypes.uint8, // 0.01s resolution, default 20
  },
  selfCalibration: {
    id: 0x0008,
    type: ZCLDataTypes.uint8,
    // Disabled: 0x00
    // Enabled: 0x01 // Default
  }
};

const COMMANDS = {};

module.exports = class AeotecWindowCoveringsConfigurationCluster extends Cluster {

  static get ID() {
    return 0xfd03;
  }

  static get NAME() {
    return 'aeotecWindowCoveringsConfiguration';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}
