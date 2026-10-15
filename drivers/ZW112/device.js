'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW112 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('alarm_contact', 'BASIC');
    this.registerCapability('measure_battery', 'BATTERY');
  }

}

module.exports = ZW112;
