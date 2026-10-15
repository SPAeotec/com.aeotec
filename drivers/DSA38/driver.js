'use strict';

const Homey = require('homey');

class AeotecPanicButtonDeviceDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.pressTrigger = this.homey.flow.getDeviceTriggerCard('dsa38_press_1');
    this.holdTrigger = this.homey.flow.getDeviceTriggerCard('dsa38_hold_1');
  }

}

module.exports = AeotecPanicButtonDeviceDriver;
