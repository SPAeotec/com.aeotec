'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecMultiSensorSevenDevice extends ZwaveDevice {

  onNodeInit() {
	  
	 this.enableDebug();
     this.printNode();
    

    this.registerCapability('measure_battery', 'BATTERY');
	this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_ultraviolet', 'SENSOR_MULTILEVEL');


// Hilfsfunktion für Home Security Events
function parseHomeSecurityEvent(report, activeEvent) {
  if (!report || report['Notification Type'] !== 'Home Security') return null;

  const event = report['Event'];
  const param = report['Event Parameter']?.[0];

  if (event === activeEvent) return true;
  if (event === 0 && param === activeEvent) return false;

  return null;
}

// Motion Sensor
this.registerCapability('alarm_motion', 'SENSOR_BINARY');

this.registerCapability('alarm_motion', 'NOTIFICATION', {
  reportParser: report => {
    try {
      return parseHomeSecurityEvent(report, 8);
    } catch (error) {
      console.error('Error in alarm_motion reportParser:', error);
      return null;
    }
  }
});

// Vibration Sensor
this.registerCapability('alarm_tamper', 'NOTIFICATION', {
  reportParser: report => {
    try {
      // Nur aktiv, wenn Setting '1' true ist
      if (this.getSetting('1') !== true) return null;
      return parseHomeSecurityEvent(report, 9);
    } catch (error) {
      console.error('Error in alarm_tamper reportParser:', error);
      return null;
    }
  }
});


    // this.registerCapability('alarm_motion', 'SENSOR_BINARY');
   
// // Motion sensor
	// this.registerCapability('alarm_motion', 'NOTIFICATION', {
	  // reportParser: report => {
		// try {
		  // if (!report) return null;

		  // if (report['Notification Type'] === 'Home Security') {
			// if (report['Event'] === 8) {
			  // return true;
			// }
			// if (report['Event'] === 0 && report['Event Parameter']?.[0] === 8) {
			  // return false;
			// }
		  // }

		  // return null;
		// } catch (error) {
		  // console.error('Error in alarm_motion reportParser:', error);
		  // return null;
		// }
	  // }
	// });

// //Vibration Sensor
	// this.registerCapability('alarm_tamper', 'NOTIFICATION', {
	  // reportParser: report => {
		// try {
		  // if (!report) return null;

		  // if (report['Notification Type'] === 'Home Security') {
			// if (this.getSetting('1') === true && report['Event'] === 9) {
			  // return true;
			// }
			// if (report['Event'] === 0 && report['Event Parameter']?.[0] === 9) {
			  // return false;
			// }
		  // }

		  // return null;
		// } catch (error) {
		  // console.error('Error in alarm_tamper reportParser:', error);
		  // return null;
		// }
	  // }
	// });




 
    }

}

module.exports = AeotecMultiSensorSevenDevice;
