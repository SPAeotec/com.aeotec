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

    this.registerCapability('alarm_motion', 'SENSOR_BINARY');
   




this.registerCapability('alarm_tamper', 'NOTIFICATION', {
  reportParser: report => {
    try {
      if (!report) return null;

      // Prüfen auf Einschaltbedingung
      if (report['Notification Type'] === 'Home Security' && this.getSetting('1') === true && report['Event'] === 9) {
        return true;
      }

      // Prüfen auf Abschaltbedingung
      if (report['Notification Type'] === 'Home Security' && report['Event'] === 0) {
        return false;
      }

      return null;
    } catch (error) {
      console.error('Error in reportParser:', error);
      return null;
    }
  }
});



 
    }

}

module.exports = AeotecMultiSensorSevenDevice;
