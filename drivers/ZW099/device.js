'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecSmartDimmerSixDevice extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
      this.setCapabilityValue('onoff', !!report.Value);
    });

    this.registerCapability('dim', 'SWITCH_MULTILEVEL');

    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');

    this.registerSetting('80', input => Buffer.from([(input) ? 2 : 0]));
  }

}

module.exports = AeotecSmartDimmerSixDevice;
