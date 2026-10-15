'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA022 extends ZwaveDevice {

	onNodeInit() {
		
		//this.enableDebug();
        //this.printNode();
		// TODO: add battery type (INTERNAL) to driver.compose
         this._batteryTrigger = this.driver.batteryTrigger;
         this._sceneTrigger = this.driver.sceneTrigger;
        this.registerCapability('measure_battery', 'BATTERY');
         
		this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
			if (report.hasOwnProperty('Properties1') &&
				report.Properties1.hasOwnProperty('Key Attributes') &&
				report.hasOwnProperty('Scene Number')) {
				const data = {
					button: report['Scene Number'].toString(),
					scene: report.Properties1['Key Attributes'],
				};
				this._sceneTrigger.trigger(this, null, data).catch(this.error);
			}
			
		});
		  
	}

	

	
		async sceneRunListener(args, state) {
			if (!args) throw new Error('No arguments provided');
			if (!state) throw new Error('No state provided');

			if (args.button && state.button
				&& args.scene && state.scene) {
				return (args.button === state.button && args.scene === state.scene);
    } 			throw new Error('Button or scene undefined in args or state');
  }
	
}

module.exports = ZWA022;
