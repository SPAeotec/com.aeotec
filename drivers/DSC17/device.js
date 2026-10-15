'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');


class DSC17 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'BASIC');
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
	
	this.registerSetting('80', value => new Buffer([(value) ? 2 : 0]));
	
  }

}

module.exports = DSC17;
