'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSB29 extends ZwaveDevice {

	onNodeInit() {
		this.registerCapability('alarm_contact', 'BASIC');
		this.registerCapability('measure_battery', 'BATTERY');
	
	
	//this.printNode();
	//this.enableDebug();
	}
	
	
}

module.exports = DSB29;
