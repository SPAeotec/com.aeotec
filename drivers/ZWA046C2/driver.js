'use strict';

const Homey = require('homey');

class ZWA046C2 extends Homey.Driver {

  onInit() {
    super.onInit();
	
	this.resetMeterImport = this.homey.flow.getActionCard('ZWA046C2_reset_meter_import')
	this.resetMeterImport.registerRunListener((args, state) => {
		return args.device.resetMeterImportRunListener(args, state);
	});
	
	this.resetMeterExport = this.homey.flow.getActionCard('ZWA046C2_reset_meter_export')
	this.resetMeterExport.registerRunListener((args, state) => {
		return args.device.resetMeterExportRunListener(args, state);
  
   });
   
   	this.resetMeterApparentImport = this.homey.flow.getActionCard('ZWA046C2_reset_meter_apparent_import')
	this.resetMeterApparentImport.registerRunListener((args, state) => {
		return args.device.resetMeterApparentImportRunListener(args, state);
	});
	
	this.resetMeterApparentExport = this.homey.flow.getActionCard('ZWA046C2_reset_meter_apparent_export')
	this.resetMeterApparentExport.registerRunListener((args, state) => {
		return args.device.resetMeterApparentExportRunListener(args, state);
  
   });
  }

}

module.exports = ZWA046C2;