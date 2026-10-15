'use strict';

const Homey = require('homey');

class ZWA022Driver extends Homey.Driver {
    onInit() {
        super.onInit();

        this.batteryTrigger = this.homey.flow.getDeviceTriggerCard('ZWA022_battery_full');
        this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('ZWA022_scene');
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
		
    });
		
          
            }
}

module.exports = ZWA022Driver;

