'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecSmartSwitchDevice extends ZwaveDevice {

 async onNodeInit({ node }) {
	  
	this.enableDebug();
    this.printNode();
	
	this._resetMeter = this.driver.resetMeter;
	
    this.registerCapability('onoff', 'SWITCH_BINARY', {
			getOpts: {
				getOnStart: true,
				pollInterval: 180000
	
			},
		});
  this.registerCapability('measure_power', 'METER', {
			getOpts: {
				getOnStart: true
			}
		});
			
    this.registerCapability('meter_power', 'METER', {
			getOpts: {
				getOnStart: true
			}
		});
	this.registerCapability('measure_voltage', 'METER', {
			getOpts: {
				getOnStart: true
			}
		});
this.registerCapability('measure_current', 'METER', {
			getOpts: {
				getOnStart: true
			}
		});
			
	 
	this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
    this.setCapabilityValue('onoff', !!report.Value).catch(this.error);
    });

    this.registerSetting('80', input => Buffer.from([(input) ? 2 : 0]));
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

module.exports = AeotecSmartSwitchDevice;
