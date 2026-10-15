'use strict';

const Homey = require('homey');

class ZW075 extends Homey.Driver {

  onInit() {
    super.onInit();
	
    this.resetMeter = this.homey.flow.getActionCard('ZW075_reset_meter')
    this.resetMeter.registerRunListener((args, state) => {
      return args.device.resetMeterRunListener(args, state);
    });
  }

}

module.exports = ZW075;