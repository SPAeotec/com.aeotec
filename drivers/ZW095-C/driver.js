'use strict';

const Homey = require('homey');

class AeotecHomeEnergyDevice extends Homey.Driver {

  onInit() {
    super.onInit();
	
   this.resetMeter = this.homey.flow.getActionCard('ZW095_reset_meter')
   this.resetMeter.registerRunListener((args, state) => {
     return args.device.resetMeterRunListener(args, state);
   });
  }

}

module.exports = AeotecHomeEnergyDevice;