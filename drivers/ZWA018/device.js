'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA018 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('alarm_water', 'NOTIFICATION');
    
  }

}

module.exports = ZWA018;
