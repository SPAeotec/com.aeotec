'use strict';

const Homey = require('homey');

class AeotecHomeEnergyUsDevice extends Homey.Driver {

  onInit() {
    super.onInit();
	
    this.resetMeter = this.homey.flow.getActionCard('ZW095us_reset_meter')
    this.resetMeter.registerRunListener((args, state) => {
      return args.device.resetMeterRunListener(args, state);
    });
  }

}

module.exports = AeotecHomeEnergyUsDevice;