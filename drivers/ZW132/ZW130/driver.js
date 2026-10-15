'use strict';

const Homey = require('homey');

class ZW130Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.batteryTrigger = this.homey.flow.getDeviceTriggerCard('zw130_battery_full');
    this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('zw130_scene');
    this.sceneTrigger.registerRunListener((args, state) => {
      return args.device.sceneRunListener(args, state);
    });
    this.dimTrigger = this.homey.flow.getDeviceTriggerCard('zw130_dim');
    this.dimTrigger.registerRunListener((args, state) => {
      return args.device.dimRunListener(args, state);
    });
  }

}

module.exports = ZW130Driver;
