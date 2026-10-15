'use strict';

const Homey = require('homey');

class ZW141V3Driver extends Homey.Driver {

  onInit() {
    super.onInit();

  
    this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('zw141_scene');
    this.sceneTrigger.registerRunListener((args, state) => {
      return args.device.sceneRunListener(args, state);
    });
   
  }

}

module.exports = ZW141V3Driver;
