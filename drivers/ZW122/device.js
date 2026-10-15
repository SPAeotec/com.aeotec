'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

const TAMPER_TIMEOUT = 30 * 1000;

class ZW122 extends ZwaveDevice {

  onNodeInit() {
	  
	this.enableDebug();
    this.printNode();
    this.registerCapability('measure_battery', 'BATTERY');

    //this.setCapabilityValue('alarm_tamper', false);
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    //This sensor doesn't reset the tamper alarm. Use a timeout to reset the capability
    this.registerReportListener('NOTIFICATION', 'NOTIFICATION_REPORT', report => {
    if (!report || !report['Notification Status'] || !report['Notification Type']) return null;

     if (report['Notification Type'] === 'Home Security' && report['Notification Status'] === 'On') {
       this.setCapabilityValue('alarm_tamper', true);
      this.tamperTimeOut = setTimeout(() => {
          this.setCapabilityValue('alarm_tamper', false).catch(this.error);
       }, TAMPER_TIMEOUT);
    }

    return true;
	
    });

    this.registerCapability('alarm_water', 'NOTIFICATION');
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
  }
}

module.exports = ZW122;
