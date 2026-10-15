'use strict';

const Homey = require('homey');

class ZWA008 extends Homey.Driver {

  onInit() {
    super.onInit();
	
	this.flowTriggerTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA008_tilt_info_on');  
    this.flowTriggerTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerTiltInfo(args, state);
    });
	this.flowTriggerNoTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA008_tilt_info_off');  
    this.flowTriggerNoTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerNoTiltInfo(args, state);
    });
	this.flowTriggerInput = this.homey.flow.getDeviceTriggerCard('ZWA008_binary_contact_trigger');  
    this.flowTriggerInput.registerRunListener((args, state) => {
       return args.device.inputFlowListener(args, state);
	});
		
  }

}

module.exports = ZWA008;