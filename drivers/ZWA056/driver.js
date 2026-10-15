'use strict';

const Homey = require('homey');

class ZWA056 extends Homey.Driver {

  onInit() {
    super.onInit();
	
	
	this.flowTriggerPower = this.homey.flow.getDeviceTriggerCard('ZWA056_power_changed_trigger');  
    this.flowTriggerPower.registerRunListener((args, state) => {
       return args.device.flowTriggerPower(args, state);
	});
	this.dewPointTrigger = this.homey.flow.getDeviceTriggerCard('ZWA056_dewpoint_value');
	this.dewPointTrigger.registerRunListener((args, state) => {
    return args.device.dewPointTrigger(args, state);
	});
	this.flowTriggerTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA056_tilt_info_on');  
    this.flowTriggerTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerTiltInfo(args, state);
    });
	this.flowTriggerNoTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA056_tilt_info_off');  
    this.flowTriggerNoTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerNoTiltInfo(args, state);
    });
	this.flowTriggerGlassBreak = this.homey.flow.getDeviceTriggerCard('ZWA056_glass_break');  
    this.flowTriggerGlassBreak.registerRunListener((args, state) => {
      return args.device.flowTriggerGlassBreak(args, state);
    });
	this.flowTriggerEmergency = this.homey.flow.getDeviceTriggerCard('ZWA056_emergency');  
    this.flowTriggerEmergency.registerRunListener((args, state) => {
      return args.device.flowTriggerEmergency(args, state);
    });
	    this.moldAlarmOnTrigger = this.homey.flow.getDeviceTriggerCard('ZWA056_mold_alarm_on');
    this.moldAlarmOnTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOnTrigger(args, state);
	});
	
	this.moldAlarmOffTrigger = this.homey.flow.getDeviceTriggerCard('ZWA056_mold_alarm_off');
    this.moldAlarmOffTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOffTrigger(args, state);
	});
	
	


  }

}

module.exports = ZWA056;