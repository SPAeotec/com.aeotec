'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW139 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'SWITCH_BINARY');

    try {
	  this.registerReportListener('BASIC', 'BASIC_SET', report => {
		try {
		  this.setCapabilityValue('onoff', !!report.Value);
		} catch (innerError) {
		  console.error('Error setting capability value:', innerError);
		  // Handle the error or rethrow it if necessary
		}
	  });
	} catch (error) {
	  console.error('Error registering report listener:', error);
	  // Handle the error or rethrow it if necessary
	}
  }

}

module.exports = ZW139;
