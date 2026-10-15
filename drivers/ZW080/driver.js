'use strict';

const Homey = require('homey');

class AeotecSirenDeviceDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.alarmOnFlow = this.homey.flow.getActionCard('ZW080-turn_alarm_on')
      .registerRunListener(async (args, state) => {
        return args.device.onOffRunListener(args, state, true);
      });
    this.alarmOffFlow = this.homey.flow.getActionCard('ZW080-turn_alarm_off')
      .registerRunListener(async (args, state) => {
        return args.device.onOffRunListener(args, state, false);
      });

    this.changeSoundFlow = this.homey.flow.getActionCard('ZW080-set_alarm')
      .registerRunListener(async (args, state) => {
        return args.device.changeSoundRunListener(args, state);
      });
  }

}

module.exports = AeotecSirenDeviceDriver;
