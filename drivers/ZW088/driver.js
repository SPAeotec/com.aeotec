'use strict';

const Homey = require('homey');

class AeotecKeyFobDeviceDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.press1Trigger = this.homey.flow.getDeviceTriggerCard('zw088_press_1');
    this.press2Trigger = this.homey.flow.getDeviceTriggerCard('zw088_press_2');
    this.press3Trigger = this.homey.flow.getDeviceTriggerCard('zw088_press_3');
    this.press4Trigger = this.homey.flow.getDeviceTriggerCard('zw088_press_4');

    this.hold1Trigger = this.homey.flow.getDeviceTriggerCard('zw088_hold_1');
    this.hold2Trigger = this.homey.flow.getDeviceTriggerCard('zw088_hold_2');
    this.hold3Trigger = this.homey.flow.getDeviceTriggerCard('zw088_hold_3');
    this.hold4Trigger = this.homey.flow.getDeviceTriggerCard('zw088_hold_4');
  }

}

module.exports = AeotecKeyFobDeviceDriver;
