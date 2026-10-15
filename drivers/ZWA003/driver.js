'use strict';

const Homey = require('homey');

class ZWA003Driver extends Homey.Driver {
    onInit() {
        super.onInit();

        this.batteryTrigger = this.homey.flow.getDeviceTriggerCard('ZWA003_battery_full');
        this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('ZWA003_scene');
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
		
    });
		
          
            }
}

module.exports = ZWA003Driver;

