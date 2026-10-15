'use strict';

const Homey = require('homey');

class ZWA023 extends Homey.Driver {

  onInit() {
    super.onInit();
	
    this.resetMeter = this.homey.flow.getActionCard('ZWA023_reset_meter')
    this.resetMeter.registerRunListener((args, state) => {
      return args.device.resetMeterRunListener(args, state);
    });
  }

}

module.exports = ZWA023;