'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecTriSensor8Device extends ZwaveDevice {

  onNodeInit() {
	  
	this.enableDebug();
    this.printNode();
   
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_motion', 'NOTIFICATION', {
		reportParser: report => {
		if (report['Notification Type'] === 'Home Security' 
		&& report['Event'] === 8) {
			  return true;
			  }
        if (report['Notification Type'] === 'Home Security' 
			&& report['Event'] === 0) {
			  return false;  
			  };
	} 
	});

    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');

  }


}

module.exports = AeotecTriSensor8Device;
