'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSC08 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'SWITCH_BINARY');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');

    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');

    this.registerReportListener('BASIC', 'BASIC_SET', report => {
      this.setCapabilityValue('onoff', !!report.Value).catch(this.error);
    });
  }

}

module.exports = DSC08;