'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW120 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('measure_battery', 'BATTERY');

    this.registerCapability('alarm_contact', 'BASIC');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
  }

}

module.exports = ZW120;
