'use strict';

const Homey = require('homey');

class AeotecLEDBulb5Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.rainbowAction = this.homey.flow.getActionCard('zw098_rainbow')
      .registerRunListener((args, state) => {
        return args.device.rainbowModeHandler(args);
      });
  }

}

module.exports = AeotecLEDBulb5Driver;
