'use strict';

const Homey = require('homey');

class ZW129Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.batteryTrigger = this.homey.flow.getDeviceTriggerCard('zw129_battery_full');
    this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('zw129_scene');
    this.sceneTrigger.registerRunListener((args, state) => {
      return args.device.sceneRunListener(args, state);
    });
    this.dimTrigger = this.homey.flow.getDeviceTriggerCard('zw129_dim');
    this.dimTrigger.registerRunListener((args, state) => {
      return args.device.dimRunListener(args, state);
    });
  }

}

module.exports = ZW129Driver;
