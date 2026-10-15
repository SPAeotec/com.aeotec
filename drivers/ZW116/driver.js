'use strict';

const Homey = require('homey');

class ZW116 extends Homey.Driver {

  onInit() {
    super.onInit();
	
    this.resetMeter = this.homey.flow.getActionCard('ZW116_reset_meter')
    this.resetMeter.registerRunListener((args, state) => {
      return args.device.resetMeterRunListener(args, state);
    });
  }

}

module.exports = ZW116;