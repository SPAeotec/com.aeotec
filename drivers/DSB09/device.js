'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');


	class AeotecHomeEnergyG1Device extends ZwaveDevice {
	
	//onNodeInit() {
	onNodeInit() {
			
	    this.enableDebug();
        this.printNode();
	 
	    this._resetMeter = this.driver.resetMeter;
	 
	    this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		
		//Reset function
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
	  
	  		
        //Clamp1
		
		if (this.node.MultiChannelNodes.hasOwnProperty('1')) {
		this.registerCapability('measure_power.1', 'METER', {
		  multiChannelNodeId: 1,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 1),
    });
		this.registerCapability('meter_power.1', 'METER', {
        multiChannelNodeId: 1,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 1),
    });
		
		 }
		 
	if (!this.node.MultiChannelNodes.hasOwnProperty('1')
		  && this.hasCapability('measure_power.1')
			&& this.hasCapability('meter_power.1')) {
			this.removeCapability('measure_power.1')
			this.removeCapability('meter_power.1')
			};	 
		 
	     //Clamp2
	if (this.node.MultiChannelNodes.hasOwnProperty('2')) {
		this.registerCapability('measure_power.2', 'METER', {
		  multiChannelNodeId: 2,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 2),
    });
		this.registerCapability('meter_power.2', 'METER', {
        multiChannelNodeId: 2,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 2),
    });
		
		 }
		 
	if (!this.node.MultiChannelNodes.hasOwnProperty('2')
		  && this.hasCapability('measure_power.2')
			&& this.hasCapability('meter_power.2')) {
			this.removeCapability('measure_power.2')
			this.removeCapability('meter_power.2')
			};	 
	
	  //Clamp3
	  if (this.node.MultiChannelNodes.hasOwnProperty('3')) {
		this.registerCapability('measure_power.3', 'METER', {
		  multiChannelNodeId: 3,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 3),
    });
	  
	  
	  
		this.registerCapability('meter_power.3', 'METER', {
        multiChannelNodeId: 3,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 3),
    });
		
	  }
	  if (!this.node.MultiChannelNodes.hasOwnProperty('3')
		  && this.hasCapability('measure_power.3')
			&& this.hasCapability('meter_power.3')) {
			this.removeCapability('measure_power.3')
			this.removeCapability('meter_power.3')
			};
			
	this.registerSetting('cumulative', value => {
    try {
        if (value > 0) {
            this.setEnergy({ cumulative: true });
            this.log('Energy = general');
            //this.setClass('sensor');
        } else if (value < 1) {
            this.setEnergy({ cumulative: false });
            this.log('Energy = consumer');
            //this.setClass('sensor');
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
});
	  
	}
	
	resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				this.log('Action card METER_RESET triggered');
				this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
				
			} else return false;
	};
	

}
module.exports = AeotecHomeEnergyG1Device;