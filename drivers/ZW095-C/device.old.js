'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');


	class AeotecHomeEnergyDevice extends ZwaveDevice {
	
	//onNodeInit() {
	onNodeInit() {
			
	    this.enableDebug();
        this.printNode();
	 
	    this._resetMeter = this.driver.resetMeter;
	 
	    this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');
		
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
		
		
		this.registerCapability('measure_voltage.1', 'METER', {
		  multiChannelNodeId: 1,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 1),
	  });
	  
		this.registerCapability('measure_current.1', 'METER', {
		  multiChannelNodeId: 1,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 1),
	  });
		 }
		 

		 
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
		
		
		this.registerCapability('measure_voltage.2', 'METER', {
		  multiChannelNodeId: 2,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 2),
	  });
	  
		this.registerCapability('measure_current.2', 'METER', {
		  multiChannelNodeId: 2,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 2),
	  });
		 }
		 
	 
	
	
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
		
		
		this.registerCapability('measure_voltage.3', 'METER', {
		  multiChannelNodeId: 3,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 3),
	  });
	  
		this.registerCapability('measure_current.3', 'METER', {
		  multiChannelNodeId: 3,
          	get: 'METER_GET',
          	getOpts: {
          		getOnStart: true,
          	},
      report: 'METER_REPORT',
      reportParser: report => this.multiChannelNodeReportParser(report, 3),
	  });
	  };

	
const channels = ['1', '2', '3'];

channels.forEach(channelNumber => {
  if (
    !this.node.MultiChannelNodes.hasOwnProperty(channelNumber) &&
    this.hasCapability(`measure_power.${channelNumber}`) &&
    this.hasCapability(`meter_power.${channelNumber}`) &&
    this.hasCapability(`measure_voltage.${channelNumber}`) &&
    this.hasCapability(`measure_current.${channelNumber}`)
  ) {
    ['measure_power', 'meter_power', 'measure_voltage', 'measure_current'].forEach(capability => {
      this.removeCapability(`${capability}.${channelNumber}`).catch(this.error);
    });
  }
});
	try {
		this.registerSetting('clamps', value => {
			try {
				if (value == 0)  {
				  return this._setConfig(101, 4, 10),
						 this._setConfig(102, 4, 4),
						 this._setConfig(103, 4, 1),
						 this.log('Clamps = 0')
				} else if (value == 1) {
				  return this._setConfig(101, 4, 524554),
						 this._setConfig(102, 4, 65540),
						 this._setConfig(103, 4, 2049),
						 this.log('Clamps = 1');
				} else if (value == 2 ) {
				  return this._setConfig(101, 4, 1573642),
						 this._setConfig(102, 4, 196612),
						 this._setConfig(103, 4, 6145),
						 this.log('Clamps = 2');
				} else if (value == 3) {
				  return this._setConfig(101, 4, 3671818),
						 this._setConfig(102, 4, 458756),
						 this._setConfig(103, 4, 14337),
						 this.log('Clamps = 3');
			} else {
				 // Handle unsupported values or provide a default behavior
			this.log('Unsupported value for clamps');
			}
			} catch (error) {
				// Handle any errors that may occur during configuration setting
				this.log('Error setting configuration:', error);
			} 	  
      });
	 } catch (error) {
  this.log('Error registering setting:', error);
}   
	  
	  
	}
	
 async _setConfig(index, size, value) {
  const CC_configuration = this.getCommandClass('CONFIGURATION');

  if (CC_configuration instanceof Error) {
    return Promise.reject('failed_to_get_configuration_command_class');
  }

  if (typeof CC_configuration.CONFIGURATION_SET !== 'function') {
    return Promise.reject('configuration_set_function_unavailable');
  }

  let buf;

  try {
    buf = Buffer.alloc(size);
    buf.writeUIntBE(value, 0, size);
  } catch (err) {
    this.error(err);
    return Promise.reject(err);
  }


	if (buf) {
	  try {
		// Versuchen Sie, die Konfiguration zu setzen
		await CC_configuration.CONFIGURATION_SET({
		  'Parameter Number': index,
		  Level: {
			Size: size,
			Default: false,
		  },
		  'Configuration Value': buf
		});

		// Wenn keine Fehler auftreten, geben Sie ein erfolgreiches Versprechen zurück
		return Promise.resolve();
	  } catch (err) {
		// Falls ein Fehler auftritt, wird er hier erfasst und protokolliert
		this.error(err);
		return Promise.reject(err); // und ein abgelehntes Versprechen zurückgegeben
	  }
   }

 }
	resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				this.log('Action card METER_RESET triggered');
				this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
				
			} else return false;
	};
	
	
	
	//async onSettings({ oldSettings, newSettings, changedKeys }) {
	//    this.log('Changed keys', changedKeys);
     //   this.log('New Settings', newSettings);
     //   this.log('Old Settings', oldSettings);
    //    if (newSettings.cumulative === 'yes') {
	//			this.setEnergy({ cumulative: true }).catch(this.error);;
	//			this.setClass('sensor').catch(this.error);
	//		} else if  (newSettings.cumulative === 'no') {
	//			this.setEnergy({ cumulative: false }).catch(this.error);
	//			this.setClass('sensor').catch(this.error);
	//		}
			   
	//	return Promise.resolve(newSettings);		
	//};
	
		//resetMeterRunListener(args, state) {
      //  if (this.node
      //      && this.node.CommandClass
      //      && this.node.CommandClass.COMMAND_CLASS_METER) {
      //  this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}, (error, result) => {
      //  if (error) return callback(error);

        // If properly transmitted, change the setting and finish flow card
      //  return result === 'TRANSMIT_COMPLETE_OK';
       // });
       //} else return false;
  //}
}
module.exports = AeotecHomeEnergyDevice;