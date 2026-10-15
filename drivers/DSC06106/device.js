'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');


class DSC06106 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'BASIC');
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');

  }

}

module.exports = DSC06106;
