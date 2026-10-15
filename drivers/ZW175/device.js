'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');
class AeotecSmartSwitchSevenDevice extends ZwaveDevice {
	
	onNodeInit() {
	//async onNodeInit({ node }) {
		this.enableDebug();
        this.printNode();
	  
	   this._resetMeter = this.driver.resetMeter;
		
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');
//		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	
	
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
	
  

module.exports = AeotecSmartSwitchSevenDevice;

