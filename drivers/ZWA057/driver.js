'use strict';

const Homey = require('homey');

class ZWA057Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.moldAlarmOnTrigger = this.homey.flow.getDeviceTriggerCard('ZWA057_mold_alarm_on');
    this.moldAlarmOnTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOnTrigger(args, state);
	});
	
	this.moldAlarmOffTrigger = this.homey.flow.getDeviceTriggerCard('ZWA057_mold_alarm_off');
    this.moldAlarmOffTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOffTrigger(args, state);
	});
	
	this.dewPointTrigger = this.homey.flow.getDeviceTriggerCard('ZWA057_dewpoint_value');
	this.dewPointTrigger.registerRunListener((args, state) => {
    return args.device.dewPointTrigger(args, state);
	});
	
	this.flowTriggerPower = this.homey.flow.getDeviceTriggerCard('ZWA057_power_changed_trigger');  
    this.flowTriggerPower.registerRunListener((args, state) => {
    return args.device.flowTriggerPower(args, state);
	});
  }

}

module.exports = ZWA057Driver;
