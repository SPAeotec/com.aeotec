'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecRecessedContactDevice extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('alarm_contact', 'SENSOR_BINARY');
    this.registerCapability('measure_battery', 'BATTERY');
  }

}

module.exports = AeotecRecessedContactDevice;
