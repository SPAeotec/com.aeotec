'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');


	class ZWA046C3 extends ZwaveDevice {
	
	//onNodeInit() {
	onNodeInit() {
			
	    this.enableDebug();
        this.printNode();
	 
	    this._resetMeterImport = this.driver.resetMeterImport;
		this._reserMeterExport = this.driver.resetMeterExport;
		this._resetMeterApparentImport = this.driver.resetMeterApparentImport;
		this._resetMeterApparentExport = this.driver.resetMeterApparentExport;
		
		
	 try {
			this.registerCapability('measure_power', 'METER');
			this.registerCapability('meter_power', 'METER');
			this.registerCapability('measure_voltage', 'METER');
			this.registerCapability('measure_current', 'METER');
			this.registerCapability('powerFactor', 'METER');
			this.registerCapability('powerReactive', 'METER');
			this.registerCapability('powerTotalApparent', 'METER');
			this.registerCapability('powerTotalReactive', 'METER');
			
		
		} catch (error) {
			console.error('Error registering capabilities:', error);
    // Handle the error appropriately
    // For example, you could log the error, alert the user, or retry the operation
};

	// Verbraucher oder Zähler   
		this.registerSetting('cumulative1', value => {
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
		this.registerSetting('cumulative2', value => {
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
		this.registerSetting('cumulative3', value => {
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
		
		// RESET IMPORT VALUES KWH
		this.registerCapabilityListener('button.reset_meter_import', async () => {
			this.log('reset_meter_import button pressed.');
			
			if (this.node) {
				this.log('Node exists.');
				if (this.node.CommandClass.COMMAND_CLASS_METER) {
					this.log('COMMAND_CLASS_METER exists.');
					try {
						// Übergeben der korrekten Parameter für METER_RESET
						let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 1,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 0,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
						this.log('Attempting to reset meter with parameters:', resetParams);
						
						const result = await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams);
						this.log('Meter reset successfully.', result);
						return Promise.resolve();
					} catch (error) {
						this.log('Error resetting the meter:', error);
						return Promise.reject('The device could not be reset');
					}
				} else {
					this.log('COMMAND_CLASS_METER does not exist.');
					return Promise.reject('The device could not be reset');
				}
			} else {
				this.log('Node does not exist.');
				return Promise.reject('The device could not be reset');
			}
		});
		//SCHEIN & BLINDLEISTUNG IMPORT
				this.registerCapabilityListener('button.reset_meter_apparent_import', async () => {
			this.log('reset_meter_import button pressed.');
			
			if (this.node) {
				this.log('Node exists.');
				if (this.node.CommandClass.COMMAND_CLASS_METER) {
					this.log('COMMAND_CLASS_METER exists.');
					try {
						// Übergeben der korrekten Parameter für METER_RESET
						let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 1,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 1,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
						this.log('Attempting to reset meter with parameters:', resetParams);
						
						const result = await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams);
						this.log('Meter reset successfully.', result);
						return Promise.resolve();
					} catch (error) {
						this.log('Error resetting the meter:', error);
						return Promise.reject('The device could not be reset');
					}
				} else {
					this.log('COMMAND_CLASS_METER does not exist.');
					return Promise.reject('The device could not be reset');
				}
			} else {
				this.log('Node does not exist.');
				return Promise.reject('The device could not be reset');
			}
		});
		
		
		//RESET EXPORT VALUES
		this.registerCapabilityListener('button.reset_meter_export', async () => {
			this.log('reset_meter_export button pressed.');
			
			if (this.node) {
				this.log('Node exists.');
				if (this.node.CommandClass.COMMAND_CLASS_METER) {
					this.log('COMMAND_CLASS_METER exists.');
					try {
						// Übergeben der korrekten Parameter für METER_RESET
						let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 2,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 0,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
						this.log('Attempting to reset meter with parameters:', resetParams);
						
						const result = await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams);
						this.log('Meter reset successfully.', result);
						return Promise.resolve();
					} catch (error) {
						this.log('Error resetting the meter:', error);
						return Promise.reject('The device could not be reset');
					}
				} else {
					this.log('COMMAND_CLASS_METER does not exist.');
					return Promise.reject('The device could not be reset');
				}
			} else {
				this.log('Node does not exist.');
				return Promise.reject('The device could not be reset');
			}
		});
		// RESET SCHEIN & BLINDLEISTUNG EXPORT
				this.registerCapabilityListener('button.reset_meter_apparent_export', async () => {
			this.log('reset_meter_import button pressed.');
			
			if (this.node) {
				this.log('Node exists.');
				if (this.node.CommandClass.COMMAND_CLASS_METER) {
					this.log('COMMAND_CLASS_METER exists.');
					try {
						// Übergeben der korrekten Parameter für METER_RESET
						let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 1,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 1,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
						this.log('Attempting to reset meter with parameters:', resetParams);
						
						const result = await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams);
						this.log('Meter reset successfully.', result);
						return Promise.resolve();
					} catch (error) {
						this.log('Error resetting the meter:', error);
						return Promise.reject('The device could not be reset');
					}
				} else {
					this.log('COMMAND_CLASS_METER does not exist.');
					return Promise.reject('The device could not be reset');
				}
			} else {
				this.log('Node does not exist.');
				return Promise.reject('The device could not be reset');
			}
		});

	}

 // RESET FLOWS 	
	async resetMeterImportRunListener(args, state) {
		if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 1,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 0,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
				this.log('Action card METER_RESET triggered');
			this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams).catch(this.error);
				
			} else return false;
	};
	
	async resetMeterExportRunListener(args, state) {
		if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 2,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 2,
								'Scale bits 10': 0,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
				this.log('Action card METER_RESET triggered');
			this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams).catch(this.error);
				
			} else return false;
	};
	
		async resetMeterApparentImportRunListener(args, state) {
		if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 1,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 1,
								'Scale bits 10': 1,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
				this.log('Action card METER_RESET triggered');
			this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams).catch(this.error);
				
			} else return false;
	};
	
	async resetMeterApparentExportRunListener(args, state) {
		if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				let resetParams = { 
							Properties1: {
								'Scale bit 2': false,
								'Rate Type': 2,
								'Meter Type': 'Electric meter',
							},
							Properties2: {
								Size: 2,
								'Scale bits 10': 1,
								Precision: 0,
							},
								  'Meter Value': Buffer.from([0]),
								  'Scale 2': 0
						} ;  // Beispielstruktur
				this.log('Action card METER_RESET triggered');
			this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET(resetParams).catch(this.error);
				
			} else return false;
	};
	
}		


	
	


module.exports = ZWA046C3;