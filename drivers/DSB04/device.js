'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class DSB04 extends ZwaveDevice {

  onMeshInit() {
	  
	this.enableDebug();
	this.printNode();   
    
	this.registerCapability('alarm_contact', 'SENSOR_BINARY');
    this.registerCapability('measure_batttery', 'BATTERY');
  }

}

module.exports = DSB04;
