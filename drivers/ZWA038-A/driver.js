'use strict';

const Homey = require('homey');

class ZWA038Driver extends Homey.Driver {
    onInit() {
        super.onInit();

      
        this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('ZWA038_scene');
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
		
    });
		
          
            }
}

module.exports = ZWA038Driver;

