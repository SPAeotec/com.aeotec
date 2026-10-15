'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecFourInOneDevice extends ZwaveDevice {

  onNodeInit() {
    this.registerReportListener('BASIC', 'BASIC_SET', report => {
      this.setCapabilityValue('alarm_motion', report['Value'] === 255).catch(this.error);
    });

    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
  }

}

module.exports = AeotecFourInOneDevice;
