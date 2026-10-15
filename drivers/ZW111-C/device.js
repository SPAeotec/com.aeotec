'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW111C extends ZwaveDevice {

  async onNodeInit({ node }) {
	  
	this.enableDebug();
    this.printNode();
	  
	this._resetMeter = this.driver.resetMeter;
	  
    this.registerCapability('onoff', 'SWITCH_BINARY');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');

    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
    if (this.hasCapability('measure_voltage')) this.registerCapability('measure_voltage', 'METER');
    if (this.hasCapability('measure_current')) this.registerCapability('measure_current', 'METER');

   // this.registerReportListener('BASIC', 'BASIC_SET', report => {
   //   this.setCapabilityValue('onoff', !!report.Value).catch(this.error);
  // });
	
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
	
	this.registerCapabilityListener('button.reset_meter', async () => 
		    {
		    	// Register button. Maintenance action button was pressed, return a promise
				if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
				{
					this.log('Maintainance button METER_RESET pushed.');
					return await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({});

				}
				this.log('Does not support meter resets, or not a valid node.');
				return Promise.reject('The device could not be reset');
		    }	
	    );
	}
	
	resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				this.log('Action card METER_RESET triggered');
				this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
				
			} else return false;
	};

}

module.exports = ZW111C;
