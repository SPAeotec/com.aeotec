
'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecRecessedDoorSensor7 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    this.enableDebug();
    this.printNode();
  }

}

module.exports = AeotecRecessedDoorSensor7;
