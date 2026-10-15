'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW141V2 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'SWITCH_BINARY');
    this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL');
	

    this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
      this.setCapabilityValue('onoff', !!report.Value).catch(this.error);
    });

    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_REPORT', report => {
      this.setCapabilityValue('windowcoverings_set', !!report.Value).catch(this.error);
    });
  }

}

module.exports = ZW141V2;
